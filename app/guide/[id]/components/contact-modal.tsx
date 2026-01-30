"use client";

import { useState } from "react";
import { Phone, Mail, X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactModalProps {
  hostName?: string | null;
  hostPhone?: string | null;
  hostEmail?: string | null;
}

export function ContactModal({ hostName, hostPhone, hostEmail }: ContactModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Don't render if no contact info
  if (!hostPhone && !hostEmail) return null;

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-xl",
          "bg-gradient-to-r from-amber-500 to-orange-500",
          "flex items-center justify-center text-white",
          "hover:scale-105 transition-transform z-50"
        )}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 sm:items-center sm:p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className={cn(
              "bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6",
              "animate-in slide-in-from-bottom duration-300"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Contact Host</h2>
                {hostName && (
                  <p className="text-gray-500">{hostName}</p>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Contact Options */}
            <div className="space-y-3">
              {hostPhone && (
                <a
                  href={`tel:${hostPhone}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Call</p>
                    <p className="text-sm text-gray-500">{hostPhone}</p>
                  </div>
                </a>
              )}

              {hostPhone && (
                <a
                  href={`sms:${hostPhone}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Text Message</p>
                    <p className="text-sm text-gray-500">Send SMS</p>
                  </div>
                </a>
              )}

              {hostEmail && (
                <a
                  href={`mailto:${hostEmail}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-500">{hostEmail}</p>
                  </div>
                </a>
              )}
            </div>

            {/* Bottom safe area for mobile */}
            <div className="h-6 sm:hidden" />
          </div>
        </div>
      )}
    </>
  );
}
