import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/server';

export const runtime = 'nodejs';

type ConversationTurn = { role: 'bot' | 'customer'; text: string };

type IncomingMessage = {
  from?: string;
  id?: string;
  type?: string;
  text?: { body?: string };
};

type WhatsAppPayload = {
  entry?: Array<{
    changes?: Array<{
      value?: { messages?: IncomingMessage[] };
    }>;
  }>;
};

function equalSecret(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function isValidSignature(rawBody: string, signature: string | null, appSecret: string) {
  const match = signature?.match(/^sha256=([a-f\d]{64})$/i);
  if (!match) return false;

  const expected = createHmac('sha256', appSecret).update(rawBody).digest();
  const received = Buffer.from(match[1], 'hex');
  return received.length === expected.length && timingSafeEqual(received, expected);
}

async function sendWhatsAppMessage(to: string, text: string) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const apiVersion = process.env.WHATSAPP_API_VERSION || 'v23.0';
  if (!accessToken || !phoneNumberId) return false;

  const response = await fetch(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { preview_url: false, body: text.slice(0, 4000) },
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('WhatsApp message send failed with status:', response.status);
    return false;
  }
  return true;
}

async function getAssistantReply(
  request: NextRequest,
  sender: string,
  question: string,
  context: ConversationTurn[],
) {
  const assistantUrl = new URL('/api/assistant', request.url);
  const response = await fetch(assistantUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': `whatsapp:${sender}`,
    },
    body: JSON.stringify({ question: question.slice(0, 500), context: context.slice(-6), channel: 'whatsapp' }),
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`Assistant returned status ${response.status}`);
  const result = await response.json() as { answer?: unknown };
  if (typeof result.answer !== 'string' || !result.answer.trim()) {
    throw new Error('Assistant returned an empty answer');
  }
  return result.answer.trim();
}

async function handleIncomingMessage(request: NextRequest, message: IncomingMessage) {
  const sender = message.from;
  const messageId = message.id;
  const question = message.text?.body?.trim();
  if (!sender || !/^\d{5,20}$/.test(sender) || !messageId || message.type !== 'text' || !question) return true;

  const supabase = getSupabaseAdmin();
  const { data: session, error: readError } = await supabase
    .from('whatsapp_chat_sessions')
    .select('messages, last_message_id, last_response')
    .eq('phone_number', sender)
    .maybeSingle();

  if (readError) {
    console.error('WhatsApp conversation lookup failed:', readError.message);
    return false;
  }

  if (session?.last_message_id === messageId && session.last_response) {
    return sendWhatsAppMessage(sender, session.last_response);
  }

  const previousMessages = Array.isArray(session?.messages)
    ? session.messages.filter((turn): turn is ConversationTurn =>
      typeof turn === 'object'
      && turn !== null
      && 'role' in turn
      && 'text' in turn
      && ((turn as ConversationTurn).role === 'bot' || (turn as ConversationTurn).role === 'customer')
      && typeof (turn as ConversationTurn).text === 'string',
    )
    : [];

  let answer: string;
  try {
    answer = await getAssistantReply(request, sender, question, previousMessages);
  } catch (error) {
    console.error('WhatsApp assistant response failed:', error);
    return false;
  }

  const messages = [
    ...previousMessages,
    { role: 'customer' as const, text: question.slice(0, 500) },
    { role: 'bot' as const, text: answer },
  ].slice(-12);
  const { error: saveError } = await supabase
    .from('whatsapp_chat_sessions')
    .upsert({
      phone_number: sender,
      messages,
      last_message_id: messageId,
      last_response: answer,
      updated_at: new Date().toISOString(),
    });

  if (saveError) {
    console.error('WhatsApp conversation save failed:', saveError.message);
    return false;
  }

  return sendWhatsAppMessage(sender, answer);
}

export async function GET(request: NextRequest) {
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
  const mode = request.nextUrl.searchParams.get('hub.mode');
  const token = request.nextUrl.searchParams.get('hub.verify_token');
  const challenge = request.nextUrl.searchParams.get('hub.challenge');

  if (!verifyToken || mode !== 'subscribe' || !token || !equalSecret(token, verifyToken) || !challenge) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  return new NextResponse(challenge, { status: 200 });
}

export async function POST(request: NextRequest) {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!appSecret || !accessToken || !phoneNumberId || !process.env.WHATSAPP_VERIFY_TOKEN || !isSupabaseConfigured()) {
    return NextResponse.json({ error: 'WhatsApp integration is not configured.' }, { status: 503 });
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 1_000_000) return NextResponse.json({ error: 'Payload too large.' }, { status: 413 });

  const rawBody = await request.text();
  if (rawBody.length > 1_000_000) return NextResponse.json({ error: 'Payload too large.' }, { status: 413 });
  if (!isValidSignature(rawBody, request.headers.get('x-hub-signature-256'), appSecret)) {
    return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 401 });
  }

  let payload: WhatsAppPayload;
  try {
    payload = JSON.parse(rawBody) as WhatsAppPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid webhook payload.' }, { status: 400 });
  }

  const messages = payload.entry?.flatMap((entry) =>
    entry.changes?.flatMap((change) => change.value?.messages || []) || [],
  ) || [];

  for (const message of messages) {
    const handled = await handleIncomingMessage(request, message);
    if (!handled) return NextResponse.json({ error: 'Unable to process WhatsApp message.' }, { status: 502 });
  }

  return NextResponse.json({ received: true });
}