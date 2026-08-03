import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';

export async function POST(request: Request) {
  const { name, email, subject, message } = await request.json();

  if (
    typeof name !== 'string' || !name.trim() ||
    typeof email !== 'string' || !email.trim() ||
    typeof message !== 'string' || !message.trim()
  ) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: 'ReportAPI Contact <onboarding@resend.dev>',
    to: process.env.CONTACT_EMAIL_TO!,
    replyTo: email,
    subject: subject?.trim() || `Contact form message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  if (error) {
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
