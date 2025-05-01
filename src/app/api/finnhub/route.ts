import { type NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import fs from 'fs';
import path from 'path';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

function getServiceAccount() {
  try {
    const filePath = path.resolve(process.cwd(), 'serviceAccountKey.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (_) {}
  return null;
}

if (!getApps().length) {
  const svc = getServiceAccount();
  if (svc) {
    initializeApp({ credential: cert(svc) });
  } else {
    initializeApp(); // will only work in Firebase prod environment
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const idToken = authHeader.replace('Bearer ', '');
  try {
    await getAuth().verifyIdToken(idToken);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  const url = `https://finnhub.io/api/v1/quote?symbol=AAPL&token=${FINNHUB_API_KEY}`;
  try {
    const apiRes = await fetch(url);
    const data = await apiRes.json();
    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
