import { useEffect, useMemo, useState } from 'react'
import { CreditCard, LoaderCircle, ShieldCheck, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAppStore } from '@/store/useAppStore'

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function formatDisplayAmount(amount, currency) {
  try {
    const normalizedAmount = Number(amount)
    if (!Number.isFinite(normalizedAmount)) {
      return `${currency.toUpperCase()} 0.00`
    }

    const majorAmount = normalizedAmount.toFixed(2)
    return `${currency.toUpperCase()} ${majorAmount}`
  } catch {
    return `${currency.toUpperCase()} ${amount}`
  }
}

function getLastFour(cardNumber) {
  return String(cardNumber || '').replace(/\s+/g, '').slice(-4) || '0000'
}

export default function PaymentDrawer({
  open = false,
  onClose = () => {},
  amount = 0,
  currency = 'php',
  orderId = null,
  orderSummary = '',
  ctaLabel = 'Pay Now',
  onSuccess,
}) {
  const { user } = useAppStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccessful, setIsSuccessful] = useState(false)
  const [message, setMessage] = useState('')
  const [formState, setFormState] = useState({
    name: user?.user_metadata?.full_name || '',
    cardNumber: '4242 4242 4242 4242',
    expiry: '12/28',
    cvc: '123',
  })

  const amountDisplay = useMemo(() => formatDisplayAmount(amount, currency), [amount, currency])

  useEffect(() => {
    if (open) {
      setIsSuccessful(false)
      setMessage('')
      setIsProcessing(false)
    }
  }, [open, orderId])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleDemoPayment = async (event) => {
    event.preventDefault()
    setMessage('')
    setIsProcessing(true)

    try {
      await wait(1500)

      const paymentRecord = {
        user_id: user?.id ?? null,
        requester_id: user?.id ?? null,
        order_id: orderId,
        amount: Number(amount),
        currency,
        status: 'paid',
        provider: 'demo_checkout',
        payment_method: 'demo_card',
        card_last4: getLastFour(formState.cardNumber),
        payer_name: formState.name,
      }

      const { error } = await supabase.from('payments').insert(paymentRecord)
      if (error) {
        console.warn('Mock payment succeeded, but the payment record could not be saved.', error)
      }

      setIsSuccessful(true)
      if (typeof onSuccess === 'function') {
        await onSuccess(paymentRecord)
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    if (isProcessing) {
      return
    }

    onClose()
  }

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform border-l border-border-rule bg-surface-white shadow-2xl transition-transform duration-300 ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between border-b border-border-rule px-5 py-4">
        <div>
          <h3 className="text-lg font-semibold text-ink-default">Checkout</h3>
          <p className="text-caption text-ink-light">Demo payment flow connected to the requester order</p>
        </div>
        <button type="button" aria-label="Close checkout" onClick={handleClose} className="rounded-full p-2 text-ink-mid hover:bg-surface-default">
          <X className="h-4 w-4" />
        </button>
      </div>

      {isSuccessful ? (
        <div className="flex h-[calc(100%-73px)] flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-status-green text-surface-white">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h4 className="text-heading-2 font-semibold text-ink-default">Payment Successful</h4>
            <p className="text-body text-ink-mid">Your mock payment for {amountDisplay} was completed locally.</p>
          </div>
          <div className="rounded-2xl border border-border-rule bg-surface-default px-4 py-3 text-left text-caption text-ink-light">
            {orderId ? <p className="font-medium text-ink-default">Order ID: {orderId}</p> : null}
            {orderSummary ? <p className="mt-1 text-ink-mid">{orderSummary}</p> : null}
            <p className="font-medium text-ink-default">Card ending in {getLastFour(formState.cardNumber)}</p>
            <p>Recorded as a mocked payment in Supabase if the `payments` table is available.</p>
          </div>
          <button
            type="button"
            className="h-11 rounded-xl bg-primary-orange px-5 text-label text-surface-white shadow-sm"
            onClick={handleClose}
          >
            Done
          </button>
        </div>
      ) : (
        <form className="flex h-[calc(100%-73px)] flex-col gap-4 overflow-y-auto px-5 py-5" onSubmit={handleDemoPayment}>
          <div className="rounded-2xl bg-primary-orange-bg px-4 py-4 text-sm text-ink-default">
            <p className="font-semibold text-primary-orange">Demo Pay</p>
            <p className="mt-1 text-ink-mid">This form simulates a payment request and finishes after a short delay.</p>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-caption uppercase tracking-wide text-ink-light">Name on Card</span>
              <input
                className="h-11 rounded-xl border border-border-rule bg-surface-white px-3 text-body text-ink-default outline-none transition focus:border-primary-orange"
                name="name"
                type="text"
                required
                value={formState.name}
                onChange={handleChange}
                placeholder="Jane Doe"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-caption uppercase tracking-wide text-ink-light">Card Number</span>
              <div className="flex items-center gap-2 rounded-xl border border-border-rule bg-surface-white px-3">
                <CreditCard className="h-4 w-4 text-ink-light" />
                <input
                  className="h-11 w-full bg-transparent text-body text-ink-default outline-none"
                  name="cardNumber"
                  type="text"
                  required
                  value={formState.cardNumber}
                  onChange={handleChange}
                  placeholder="4242 4242 4242 4242"
                  inputMode="numeric"
                />
              </div>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-2">
                <span className="text-caption uppercase tracking-wide text-ink-light">Expiry</span>
                <input
                  className="h-11 rounded-xl border border-border-rule bg-surface-white px-3 text-body text-ink-default outline-none transition focus:border-primary-orange"
                  name="expiry"
                  type="text"
                  required
                  value={formState.expiry}
                  onChange={handleChange}
                  placeholder="12/28"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-caption uppercase tracking-wide text-ink-light">CVC</span>
                <input
                  className="h-11 rounded-xl border border-border-rule bg-surface-white px-3 text-body text-ink-default outline-none transition focus:border-primary-orange"
                  name="cvc"
                  type="text"
                  required
                  value={formState.cvc}
                  onChange={handleChange}
                  placeholder="123"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-border-rule bg-surface-default px-4 py-3 text-sm text-ink-mid">
            <p className="font-semibold text-ink-default">Order summary</p>
            <p className="mt-1">Amount due: {amountDisplay}</p>
            <p className="mt-1">Mock card details are accepted for UI flow only.</p>
          </div>

          {message ? <div className="rounded-xl bg-status-red-bg px-4 py-3 text-sm text-status-red">{message}</div> : null}

          <div className="mt-auto flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary-orange px-5 text-label text-surface-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isProcessing}
            >
              {isProcessing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              <span>{isProcessing ? 'Processing...' : ctaLabel}</span>
            </button>
            <button
              type="button"
              className="h-11 rounded-xl border border-border-rule px-4 text-label text-ink-mid disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleClose}
              disabled={isProcessing}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
