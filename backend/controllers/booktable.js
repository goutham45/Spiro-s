import { insertBooking } from "../models/BookTableModel.js";

// ── Brevo API helper (uses built-in fetch — Node 18+) ─────────────
async function sendBrevoEmail({ to, toName, subject, html }) {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "api-key": process.env.BREVO_API_KEY,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            sender: { name: "Spiro's Diner", email: process.env.FROM_EMAIL },
            to: [{ email: to, name: toName || to }],
            subject,
            htmlContent: html,
        }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`Brevo ${res.status}: ${JSON.stringify(err)}`);
    }
    return res.json();
}

// ── Helpers ───────────────────────────────────────────────────────
function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
}
function formatTime(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

// ── Customer confirmation email ───────────────────────────────────
function customerEmailHtml(b) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Georgia, serif; background: #f9f6f0; margin: 0; padding: 0; }
    .wrap { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.08); }
    .header { background: #CC0000; color: #fff; text-align: center; padding: 36px 24px 28px; }
    .header h1 { margin: 0; font-size: 28px; letter-spacing: 1px; }
    .header p  { margin: 8px 0 0; font-size: 15px; opacity: .85; }
    .body { padding: 36px 40px; color: #333; }
    .body h2 { margin-top: 0; color: #CC0000; font-size: 20px; }
    .details { background: #faf8f4; border-left: 4px solid #CC0000; border-radius: 4px; padding: 20px 24px; margin: 24px 0; }
    .details table { width: 100%; border-collapse: collapse; }
    .details td { padding: 7px 0; font-size: 15px; vertical-align: top; }
    .details td:first-child { color: #888; width: 130px; }
    .details td:last-child { color: #222; font-weight: 600; }
    .note-box { background: #fff8f0; border: 1px solid #f0d0a0; border-radius: 4px; padding: 14px 18px; font-size: 14px; color: #666; }
    .footer { background: #1a1a1a; color: #888; text-align: center; padding: 20px; font-size: 13px; }
    .divider { border: none; border-top: 1px solid #eee; margin: 28px 0; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>🍽 Spiro's Diner</h1>
    <p>Brooklyn's Favourite Greek &amp; American Diner since 1985</p>
  </div>
  <div class="body">
    <h2>Your Reservation is Confirmed!</h2>
    <p>Hi ${b.book_name}, we're delighted to have you join us. Here's a summary of your booking:</p>
    <div class="details">
      <table>
        <tr><td>Date</td><td>${formatDate(b.book_when)}</td></tr>
        <tr><td>Time</td><td>${formatTime(b.book_when)}</td></tr>
        <tr><td>Party Size</td><td>${b.book_people} ${parseInt(b.book_people) === 1 ? "guest" : "guests"}</td></tr>
        <tr><td>Phone</td><td>${b.book_phone}</td></tr>
        ${b.book_note ? `<tr><td>Your Notes</td><td><div class="note-box">${b.book_note}</div></td></tr>` : ""}
      </table>
    </div>
    <hr class="divider">
    <p style="font-size:15px;">Need to change your reservation? Give us a call:</p>
    <p style="font-size:20px; font-weight:700; color:#CC0000; margin:4px 0;">(718) 891-9843</p>
    <p style="font-size:14px; color:#888;">📍 2103 Avenue U, Brooklyn, NY 11229<br>Mon–Thu 7am–6pm &nbsp;|&nbsp; Fri–Sun 7am–7pm</p>
    <p style="font-size:15px; margin-top:24px;">We look forward to seeing you soon. Whether it's our classic Greek specialties or an all-American breakfast, we'll make sure your experience is nothing short of wonderful.</p>
    <p style="font-size:15px;">Warm regards,<br><strong>The Spiros Family</strong></p>
  </div>
  <div class="footer">
    © ${new Date().getFullYear()} Spiro's Greek &amp; American Diner · Sheepshead Bay, Brooklyn, NY
  </div>
</div>
</body>
</html>`;
}

// ── Restaurant notification email ─────────────────────────────────
function restaurantEmailHtml(b) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .wrap { max-width: 560px; margin: 24px auto; background: #fff; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,.08); }
    .header { background: #1a1a1a; color: #fff; padding: 20px 28px; }
    .header h2 { margin: 0; font-size: 18px; }
    .body { padding: 28px 32px; }
    .badge { display: inline-block; background: #e8f8e8; color: #1a7a1a; font-size: 13px; font-weight: 700; padding: 4px 12px; border-radius: 20px; margin-bottom: 20px; border: 1px solid #b8e8b8; }
    table { width: 100%; border-collapse: collapse; font-size: 15px; }
    td { padding: 9px 0; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
    td:first-child { color: #888; width: 130px; }
    td:last-child { color: #111; font-weight: 600; }
    .note { background: #fffbf0; border: 1px solid #ffe0a0; border-radius: 4px; padding: 12px 16px; font-size: 14px; color: #555; }
    .footer { background: #f7f7f7; color: #999; text-align: center; padding: 14px; font-size: 12px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h2>🍽 Spiro's Diner — New Table Reservation</h2>
  </div>
  <div class="body">
    <div class="badge">✅ Confirmed</div>
    <table>
      <tr><td>Guest Name</td><td>${b.book_name}</td></tr>
      <tr><td>Email</td><td>${b.book_email}</td></tr>
      <tr><td>Phone</td><td>${b.book_phone}</td></tr>
      <tr><td>Date</td><td>${formatDate(b.book_when)}</td></tr>
      <tr><td>Time</td><td>${formatTime(b.book_when)}</td></tr>
      <tr><td>Party Size</td><td>${b.book_people} ${parseInt(b.book_people) === 1 ? "guest" : "guests"}</td></tr>
      ${b.book_note ? `<tr><td>Special Notes</td><td><div class="note">${b.book_note}</div></td></tr>` : ""}
      <tr><td>Booked At</td><td>${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET</td></tr>
    </table>
  </div>
  <div class="footer">Spiro's Greek &amp; American Diner · Brooklyn, NY · automated reservation system</div>
</div>
</body>
</html>`;
}

// ── Controller ────────────────────────────────────────────────────
export const createBooking = async (req, res) => {
    const { book_name, book_email, book_phone, book_people, book_when, book_note } = req.body;

    if (!book_name || !book_email || !book_phone || !book_people || !book_when) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    const data = {
        book_name,
        book_email,
        book_phone,
        book_people: parseInt(book_people),
        book_tables: Math.ceil(parseInt(book_people) / 4),
        user_id: null,
        book_when,
        book_note: book_note || "",
        book_status: "confirmed",
    };

    // 1. Save to database
    insertBooking(data, async (err) => {
        if (err) {
            console.error("Booking DB error:", err);
            return res.status(500).json({ error: "Could not save booking. Please try again." });
        }

        // 2. Send both emails (fire — DB is already saved so don't block)
        try {
            await Promise.all([
                sendBrevoEmail({
                    to: book_email,
                    toName: book_name,
                    subject: `Reservation Confirmed at Spiro's Diner — ${formatDate(book_when)} at ${formatTime(book_when)}`,
                    html: customerEmailHtml(data),
                }),
                sendBrevoEmail({
                    to: process.env.RESTAURANT_EMAIL,
                    toName: "Spiro's Diner",
                    subject: `New Reservation: ${book_name} · ${formatDate(book_when)} at ${formatTime(book_when)} · ${book_people} ${parseInt(book_people) === 1 ? 'guest' : 'guests'}`,
                    html: restaurantEmailHtml(data),
                }),
            ]);
            console.log(`✅ Emails sent for ${book_name} (${book_email})`);
        } catch (mailErr) {
            console.error("Email error:", mailErr.message);
        }

        res.json({
            success: true,
            message: "Booking confirmed! Check your email for details.",
            booking: { book_name, book_email, book_phone, book_people, book_when },
        });
    });
};
