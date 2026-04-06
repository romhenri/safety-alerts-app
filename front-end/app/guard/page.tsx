import { redirect } from "next/navigation";

export default function GuardIndexPage() {
  redirect("/guard/hub");
}
