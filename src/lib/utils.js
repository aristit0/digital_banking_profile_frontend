import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount) {
  if (!amount) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatNumber(num) {
  if (!num) return '0'
  return new Intl.NumberFormat('id-ID').format(num)
}

export function getSegmentBadgeColor(segment) {
  const colors = {
    mass: 'bg-gray-100 text-gray-800 border-gray-300',
    mass_affluent: 'bg-blue-100 text-blue-800 border-blue-300',
    affluent: 'bg-purple-100 text-purple-800 border-purple-300',
    high_net_worth: 'bg-amber-100 text-amber-800 border-amber-300',
  }
  return colors[segment] || colors.mass
}

export function getAccountTypeIcon(type) {
  const icons = {
    savings: '💰',
    current: '💳',
    deposit: '🏦',
    payroll: '💼',
  }
  return icons[type] || '💰'
}

export function getProductStatusColor(status) {
  const colors = {
    active: 'text-green-600 bg-green-50',
    inactive: 'text-gray-600 bg-gray-50',
    closed: 'text-red-600 bg-red-50',
    blocked: 'text-red-600 bg-red-50',
    overdue: 'text-orange-600 bg-orange-50',
    current: 'text-green-600 bg-green-50',
  }
  return colors[status] || colors.inactive
}
