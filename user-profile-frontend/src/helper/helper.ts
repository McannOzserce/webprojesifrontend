import { toast } from "sonner";

export function showErrors(error: any) {
  if (error.response && error.response.data) {
    const message = error.response.data.message;
    if (Array.isArray(message)) {
      message.forEach((m: string) => toast.error(m));
    } else {
      toast.error(message);
    }
  } else {
    toast.error("Beklenmedik bir hata oluştu");
  }
}