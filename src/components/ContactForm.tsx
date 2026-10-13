import { useState, type FormEvent } from "react";
import { site } from "../data/site";

export function ContactForm() {
  const [notice, setNotice] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (!site.contactEmail) {
      setNotice(
        "Thanks for your interest. A contact destination has not been configured yet; no message was sent.",
      );
      return;
    }
    const subject = `Earth / Action enquiry from ${form.get("name")}`;
    const body = `Name: ${form.get("name")}\nEmail: ${form.get("email")}\n\n${form.get("message")}`;
    window.location.href = `mailto:${site.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setNotice(
      "Your email app will open with the enquiry. Review it and press Send there.",
    );
  }
  return (
    <form onSubmit={submit} className="contact-form">
      <label>
        Your name
        <input name="name" autoComplete="name" required maxLength={150} />
      </label>
      <label>
        Email address
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={250}
        />
      </label>
      <label>
        Tell us about your project
        <textarea name="message" rows={4} required maxLength={5000} />
      </label>
      <button className="button" type="submit">
        Start a conversation ↗
      </button>
      <p className="form-notice" role="status">
        {notice ||
          (site.contactEmail
            ? "Opens a draft in your email app."
            : "Contact preview · sending is not connected yet.")}
      </p>
    </form>
  );
}
