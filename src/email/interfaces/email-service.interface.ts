export interface IEmailService {
  send({ to, magicLink }: SendMagicLinkEmailOptions): Promise<void>;
}
export interface SendMagicLinkEmailOptions {
  to: string;
  magicLink: string;
}
