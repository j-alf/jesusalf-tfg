import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT ?? '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export const sendInviteEmail = async (email: string, inviteCode: string | undefined) => {
    if (!inviteCode) {
        throw new Error('Invite code is required to send the email');
    }

    const inviteUrl = `${process.env.APP_URL}/groups/join/${inviteCode}`;

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'ReparTe\: Te han invitado a unirte a un grupo de gastos\'',
            html: `
                    <h1>Invitación a compartir gastos</h1>
                    <p>Se le ha invitado a unirse a un grupo de gastos compartidos.</p>
                    <p>Haga clic en el enlace a continuación para unirse:</p>
                    <a href="${inviteUrl}">${inviteUrl}</a>
                `
        });
        console.log(`Email sent successfully to ${email}`);
    } catch (error) {
        console.error(`Failed to send invitation email to ${email}:`, error);
        throw new Error('Failed to send email');
    }
};