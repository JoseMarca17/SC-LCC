using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace SCLCC.Backend.Services;

public interface IEmailService
{
    Task SendOtpEmailAsync(string toEmail, string toName, string otpCode);
}

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendOtpEmailAsync(string toEmail, string toName, string otpCode)
    {
        var settings = _config.GetSection("EmailSettings");

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(settings["SenderName"], settings["SenderEmail"]));
        message.To.Add(new MailboxAddress(toName, toEmail));
        message.Subject = "SC-LCC | Código de Verificación de Acceso";

        // HTML del correo — estilo militar coherente con tu frontend
        message.Body = new TextPart("html")
        {
            Text = $"""
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="margin:0;padding:0;background:#060A12;font-family:'Courier New',monospace;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#060A12;padding:40px 0;">
                <tr>
                  <td align="center">
                    <table width="480" cellpadding="0" cellspacing="0" style="background:#0D1526;border:1px solid #1E3050;border-top:3px solid #FFD100;">
                      
                      <!-- Header -->
                      <tr>
                        <td style="padding:32px 40px 24px;border-bottom:1px solid #1E3050;">
                          <p style="margin:0;font-size:9px;letter-spacing:4px;color:#FFD100;text-transform:uppercase;font-weight:bold;">
                            // ACCESO RESTRINGIDO — SC-LCC
                          </p>
                          <h1 style="margin:8px 0 0;font-size:22px;font-weight:900;color:#FFFFFF;text-transform:uppercase;letter-spacing:2px;">
                            Verificación de Identidad
                          </h1>
                        </td>
                      </tr>

                      <!-- Body -->
                      <tr>
                        <td style="padding:32px 40px;">
                          <p style="margin:0 0 8px;font-size:11px;color:#6A88A8;text-transform:uppercase;letter-spacing:2px;">
                            Personal: {toName}
                          </p>
                          <p style="margin:0 0 28px;font-size:12px;color:#94A3B8;line-height:1.6;">
                            Se ha iniciado un intento de acceso al sistema. 
                            Utilice el siguiente código de verificación:
                          </p>

                          <!-- Código OTP -->
                          <div style="background:#060A12;border:1px solid #FFD100;padding:28px;text-align:center;margin-bottom:28px;">
                            <p style="margin:0 0 6px;font-size:9px;letter-spacing:3px;color:#6A88A8;text-transform:uppercase;">
                              CÓDIGO DE ACCESO
                            </p>
                            <p style="margin:0;font-size:42px;font-weight:900;letter-spacing:12px;color:#FFD100;">
                              {otpCode}
                            </p>
                          </div>

                          <p style="margin:0 0 6px;font-size:11px;color:#DC2626;text-transform:uppercase;letter-spacing:2px;font-weight:bold;">
                            ⚠ Este código expira en 5 minutos
                          </p>
                          <p style="margin:0;font-size:11px;color:#475569;line-height:1.6;">
                            Si no reconoce este intento de acceso, ignore este mensaje 
                            y reporte al administrador del sistema.
                          </p>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="padding:20px 40px;border-top:1px solid #1E3050;">
                          <p style="margin:0;font-size:9px;color:#1E3050;text-transform:uppercase;letter-spacing:2px;">
                            ESTADO PLURINACIONAL DE BOLIVIA // SC-LCC // 2026
                          </p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """
        };

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(
            settings["SmtpHost"],
            int.Parse(settings["SmtpPort"]!),
            SecureSocketOptions.StartTls
        );
        await smtp.AuthenticateAsync(settings["SmtpUser"], settings["SmtpPassword"]);
        await smtp.SendAsync(message);
        await smtp.DisconnectAsync(true);
    }
}