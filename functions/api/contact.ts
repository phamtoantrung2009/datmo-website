export const onRequestPost: PagesFunction = async (context) => {
  const { request, env } = context;

  try {
    const form = await request.formData();
    const name = (form.get('full_name') || '').toString().trim();
    const phone = (form.get('phone') || '').toString().trim();
    const service = (form.get('service') || '').toString().trim();
    const message = (form.get('message') || '').toString().trim();
    const company = (form.get('company') || '').toString().trim();
    const ts = (form.get('ts') || '').toString().trim();

    if (company) {
      return json({ success: false, message: 'Spam detected.' }, 400);
    }

    if (!name || !phone || !service) {
      return json({ success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc.' }, 400);
    }

    if (ts) {
      const delta = Date.now() - Number(ts);
      if (!Number.isFinite(delta) || delta < 1000) {
        return json({ success: false, message: 'Vui lòng thử lại sau.' }, 429);
      }
    }

    const toEmail = env.CONTACT_EMAIL || 'ctcpdulich.datmo@gmail.com';
    const fromEmail = env.CONTACT_FROM || 'ctcpdulich.datmo@gmail.com';

    const subject = 'Yêu cầu tư vấn từ Datmo.io.vn';
    const contentText =
      `Họ tên: ${name}\n` +
      `Số điện thoại: ${phone}\n` +
      `Dịch vụ: ${service}\n` +
      `Nội dung: ${message || '—'}\n`;

    const mail = {
      personalizations: [
        { to: [{ email: toEmail }] },
      ],
      from: { email: fromEmail, name: 'Datmo.io.vn' },
      reply_to: { email: toEmail, name: 'Datmo.io.vn' },
      subject,
      content: [{ type: 'text/plain', value: contentText }],
    };

    const resp = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(mail),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      return json({ success: false, message: 'Gửi email thất bại.', detail }, 502);
    }

    return json({ success: true }, 200);
  } catch (err) {
    return json({ success: false, message: 'Có lỗi xảy ra.' }, 500);
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
