import { sendMagicLinkEmail } from "./email.utils";
import {
  IEmailService,
  SendMagicLinkEmailOptions,
} from "./interfaces/email-service.interface";

export class EmailService implements IEmailService {
  async send({ to, magicLink }: SendMagicLinkEmailOptions): Promise<void> {
    await sendMagicLinkEmail({ to, magicLink });
  }
}
