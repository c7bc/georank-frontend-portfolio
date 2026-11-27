"use server";

import { apiFetch } from "@/lib/api/client";
import { revalidatePath } from "next/cache";

export async function updateProfile(name: string) {
  await apiFetch("/auth/profile", {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
  revalidatePath("/(app)", "layout");
}

export async function updateWorkspace(name: string) {
  await apiFetch("/auth/workspace", {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
  revalidatePath("/(app)", "layout");
}

export async function requestEmailChange(new_email: string, password: string) {
  return apiFetch<{ message: string }>("/auth/email/request", {
    method: "POST",
    body: JSON.stringify({ new_email, password }),
  });
}

export async function confirmEmailChange(code: string) {
  return apiFetch<{ message: string }>("/auth/email/confirm", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export async function requestPasswordChange(current_password: string, new_password: string) {
  return apiFetch<{ message: string }>("/auth/password/request", {
    method: "POST",
    body: JSON.stringify({ current_password, new_password }),
  });
}

export async function confirmPasswordChange(code: string) {
  return apiFetch<{ message: string }>("/auth/password/confirm", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}
