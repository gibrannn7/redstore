<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    use ApiResponse;

    public function notification(Request $request)
    {
        try {
            $notificationBody = json_decode($request->getContent(), true);
            
            // Log notification for debugging
            Log::info('Midtrans Notification', $notificationBody);

            $invoiceNumber = $notificationBody['order_id'];
            $transactionStatus = $notificationBody['transaction_status'];
            $fraudStatus = $notificationBody['fraud_status'];

            $order = Order::where('invoice_number', $invoiceNumber)->first();

            if (!$order) {
                return $this->errorResponse('Order not found', 404);
            }

            $payment = Payment::where('order_id', $order->id)->first();

            if ($transactionStatus == 'capture') {
                if ($fraudStatus == 'challenge') {
                    $this->updateStatus($order, $payment, 'challenge');
                } else if ($fraudStatus == 'accept') {
                    $this->updateStatus($order, $payment, 'success');
                }
            } else if ($transactionStatus == 'settlement') {
                $this->updateStatus($order, $payment, 'success');
            } else if ($transactionStatus == 'cancel' ||
              $transactionStatus == 'deny' ||
              $transactionStatus == 'expire') {
                $this->updateStatus($order, $payment, 'failure');
            } else if ($transactionStatus == 'pending') {
                $this->updateStatus($order, $payment, 'pending');
            }

            return response()->json(['status' => 'ok']);

        } catch (\Exception $e) {
            Log::error('Payment Notification Error: ' . $e->getMessage());
            return $this->errorResponse('Server Error', 500);
        }
    }

    protected function updateStatus(Order $order, $payment, $status)
    {
        if ($status == 'success') {
            $order->payment_status = 'paid';
            $order->status = 'processing';
            $payment->status = 'success';
        } elseif ($status == 'failure') {
            $order->payment_status = 'failed';
            $order->status = 'cancelled';
            $payment->status = 'failed';
        } elseif ($status == 'challenge') {
             $order->payment_status = 'pending';
             $payment->status = 'challenge';
        } else {
             $order->payment_status = 'pending';
             $payment->status = 'pending';
        }

        $order->save();
        $payment->save();
    }
}
