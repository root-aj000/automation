import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email, name, page } = await request.json();

        // Validate email
        if (!email || !email.includes("@")) {
            return NextResponse.json(
                { status: "error", message: "Invalid email address" },
                { status: 400 }
            );
        }

        // Get webhook URL from environment
        const webhookUrl = process.env.GOOGLE_WEBHOOK_URL;

        if (!webhookUrl) {
            console.error("GOOGLE_WEBHOOK_URL not configured");
            return NextResponse.json(
                { status: "error", message: "Subscription service unavailable" },
                { status: 500 }
            );
        }

        // Send to Google Apps Script webhook
        const response = await fetch(webhookUrl, {
            method: "POST",
            body: JSON.stringify({
                email,
                name: name || "",
                source: "website",
                page: page || "/home"
            }),
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`Webhook failed: ${response.status}`);
        }

        const result = await response.json();

        return NextResponse.json({
            status: "success",
            message: "Successfully subscribed!",
        });
    } catch (error) {
        console.error("Subscribe error:", error);
        return NextResponse.json(
            { status: "error", message: "Failed to subscribe. Please try again." },
            { status: 500 }
        );
    }
}
