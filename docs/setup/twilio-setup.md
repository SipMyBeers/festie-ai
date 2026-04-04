# Twilio SMS Setup

## Account
- Console: https://console.twilio.com
- Phone Number: (877) 509-2803

## 1. Upgrade from Trial

Go to console.twilio.com → Upgrade. Trial accounts can only send to verified numbers. You need a paid account for production.

Cost: ~$20 initial credit, then pay-as-you-go (~$1.15/month for the number + $0.0079/SMS).

## 2. Configure Webhook

1. Go to **Phone Numbers** → **Active Numbers** → click `+1 877 509 2803`
2. Scroll to **Messaging**
3. Under "A message comes in", set:
   - Webhook: `https://festie.ai/api/sms`
   - Method: HTTP POST
4. Save

## 3. Toll-Free Verification

The number shows "Toll free verification required". Complete this:

1. Go to **Messaging** → **Toll-Free Verification**
2. Fill out the form (use case: festival information service)
3. Approval takes 1-3 business days

Without verification, messages may be filtered by carriers.

## 4. Test

Send a text to (877) 509-2803 from your phone. You should get a response within 3-5 seconds.

## Cost Estimate

| Monthly Users | Messages/User | Total Messages | Cost |
|---------------|---------------|----------------|------|
| 100 | 50 | 5,000 | ~$40 |
| 500 | 50 | 25,000 | ~$200 |
| 1,000 | 50 | 50,000 | ~$400 |

At $4-5 per user, you're profitable at any scale.
