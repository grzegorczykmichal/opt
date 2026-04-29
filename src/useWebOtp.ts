import { useEffect } from "react";

export function useWebOTP(
  onReceive: (code: string) => void,
  onLog: (msg: string) => void = () => {},
) {
  useEffect(() => {
    const ts = () => new Date().toISOString();

    onLog(`[${ts()}] useEffect fired`);
    onLog(`[${ts()}] userAgent: ${navigator.userAgent}`);
    onLog(`[${ts()}] OTPCredential in window: ${"OTPCredential" in window}`);
    onLog(`[${ts()}] location.origin: ${location.origin}`);

    if (!("OTPCredential" in window)) {
      onLog(`[${ts()}] Web OTP API NOT supported — bailing`);
      return;
    }

    const ac = new AbortController();
    onLog(`[${ts()}] AbortController created`);
    onLog(`[${ts()}] calling navigator.credentials.get ...`);

    navigator.credentials
      .get({
        // @ts-ignore
        otp: { transport: ["sms"] },
        signal: ac.signal,
      })
      .then((otp) => {
        onLog(`[${ts()}] .then() fired — promise resolved!`);
        onLog(`[${ts()}] otp type: ${(otp as any)?.type}`);
        onLog(`[${ts()}] otp code: ${(otp as any)?.code}`);
        onLog(`[${ts()}] full JSON: ${JSON.stringify(otp)}`);
        console.log("OTP received:", otp);
        if (otp && "code" in otp) {
          onReceive((otp as any).code);
        }
      })
      .catch((err) => {
        onLog(`[${ts()}] .catch() fired`);
        onLog(`[${ts()}] name: ${err?.name}`);
        onLog(`[${ts()}] message: ${err?.message}`);
        onLog(`[${ts()}] stack: ${err?.stack}`);
        console.error("OTP error:", err);
      });

    return () => {
      onLog(`[${ts()}] cleanup — aborting`);
      ac.abort();
    };
  }, []);
}
