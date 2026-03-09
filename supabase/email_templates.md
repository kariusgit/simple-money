# Simple Money - Premium Email Templates

Below are the high-quality HTML templates designed for the **Simple Money** platform. These are optimized for Supabase Auth settings.

---

## 1. Confirm Signup Template
**Supabase Setting**: `Authentication` -> `Email Templates` -> `Confirm signup`

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #050505; margin: 0; padding: 0; color: #ffffff; }
        .container { max-width: 600px; margin: 40px auto; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 24px; overflow: hidden; }
        .header { padding: 40px; text-align: center; background: linear-gradient(135deg, #0284c7 0%, #7c3aed 100%); }
        .logo { font-size: 32px; font-weight: 900; color: #ffffff; letter-spacing: -1px; }
        .content { padding: 40px; }
        .title { font-size: 24px; font-weight: 800; margin-bottom: 20px; color: #ffffff; }
        .text { font-size: 16px; color: #a1a1aa; line-height: 1.6; margin-bottom: 30px; }
        .button { display: inline-block; background: #0284c7; color: #ffffff !important; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
        .footer { padding: 30px; border-top: 1px solid #1a1a1a; text-align: center; font-size: 12px; color: #52525b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">SIMPLE<span style="opacity: 0.6">MONEY</span></div>
        </div>
        <div class="content" style="text-align: center;">
            <h1 class="title">Verify Your Neural Link</h1>
            <p class="text">
                Welcome to the Simple Money network. To activate your account and start optimizing nodal yields, please confirm your email address.
            </p>
            <a href="{{ .ConfirmationURL }}" class="button">Verify My Account</a>
            <p class="text" style="font-size: 12px; margin-top: 30px; opacity: 0.5;">
                If you didn't create an account, you can safely ignore this email.
            </p>
        </div>
        <div class="footer">
            © 2026 Simple Money • Operations & Support Hub<br>
            Neural Optimization Technology v1.0.4
        </div>
    </div>
</body>
</html>
```

---

## 2. Reset Password Template
**Supabase Setting**: `Authentication` -> `Email Templates` -> `Reset password`

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #050505; margin: 0; padding: 0; color: #ffffff; }
        .container { max-width: 600px; margin: 40px auto; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 24px; overflow: hidden; }
        .header { padding: 40px; text-align: center; background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%); }
        .logo { font-size: 32px; font-weight: 900; color: #ffffff; letter-spacing: -1px; }
        .content { padding: 40px; }
        .title { font-size: 24px; font-weight: 800; margin-bottom: 20px; color: #ffffff; }
        .text { font-size: 16px; color: #a1a1aa; line-height: 1.6; margin-bottom: 30px; }
        .button { display: inline-block; background: #7c3aed; color: #ffffff !important; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
        .footer { padding: 30px; border-top: 1px solid #1a1a1a; text-align: center; font-size: 12px; color: #52525b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">SIMPLE<span style="opacity: 0.6">MONEY</span></div>
        </div>
        <div class="content" style="text-align: center;">
            <h1 class="title">Secure Protocol Override</h1>
            <p class="text">
                A password reset request has been initiated for your account. Please use the secure link below to update your authentication credentials.
            </p>
            <a href="{{ .ConfirmationURL }}" class="button">Reset Password</a>
            <p class="text" style="font-size: 12px; margin-top: 30px; opacity: 0.5;">
                If you did not request this, please secure your account or contact the Concierge Desk immediately.
            </p>
        </div>
        <div class="footer">
            © 2026 Simple Money • Concierge Desk<br>
            Neural Optimization Technology v1.0.4
        </div>
    </div>
</body>
</html>
```

---

## Instructions for the USER
1. Open your **Supabase Dashboard**.
2. Go to **Authentication** -> **Email Templates**.
3. Select **Confirm signup** and paste the first HTML block into the `Body` field.
4. Select **Reset password** and paste the second HTML block into the `Body` field.
5. Ensure the **Confirm email** toggle is **ON** in `Authentication` -> `Providers` -> `Email`.
