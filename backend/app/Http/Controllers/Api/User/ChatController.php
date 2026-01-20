<?php

namespace App\Http\Controllers\Api\User;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $conversations = Conversation::with(['store', 'user'])
            ->where('user_id', $request->user()->id)
            ->orderBy('last_message_at', 'desc')
            ->get();

        return $this->successResponse($conversations);
    }

    public function show(Request $request, $id)
    {
        $conversation = Conversation::with('store')
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $messages = Message::where('conversation_id', $conversation->id)
            ->orderBy('created_at', 'asc')
            ->get();

        return $this->successResponse([
            'conversation' => $conversation,
            'messages' => $messages
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'store_id' => 'nullable|exists:stores,id',
            'conversation_id' => 'nullable|exists:conversations,id',
            'message' => 'required|string',
        ]);

        $conversation = null;

        if ($request->conversation_id) {
             $conversation = Conversation::where('id', $request->conversation_id)
                ->where('user_id', $request->user()->id)
                ->firstOrFail();
        } elseif ($request->store_id) {
             $conversation = Conversation::firstOrCreate(
                [
                    'user_id' => $request->user()->id,
                    'store_id' => $request->store_id,
                ],
                ['last_message_at' => now()]
            );
        } else {
            return $this->errorResponse('Store ID or Conversation ID required', 422);
        }

        // Create message
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_type' => 'App\Models\User',
            'sender_id' => $request->user()->id,
            'body' => $request->message,
            'is_read' => false,
        ]);

        // Update last message timestamp
        $conversation->update(['last_message_at' => now()]);

        // Broadcast event
        broadcast(new MessageSent($message))->toOthers();

        return $this->successResponse($message, 'Message sent', 201);
    }

}
