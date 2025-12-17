import React, { useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, User, CreditCard, Building2, TrendingUp, 
  Phone, Mail, MapPin, Wallet, PiggyBank, Home,
  Calendar, Target, Activity, Award, ChevronRight,
  Loader2, AlertCircle
} from 'lucide-react'
import { formatCurrency, formatDate, formatNumber, getSegmentBadgeColor, getProductStatusColor } from '@/lib/utils'

function App() {
  const [customerIds, setCustomerIds] = useState('')
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState([])
  const [error, setError] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const handleSearch = async () => {
    if (!customerIds.trim()) {
      setError('Please enter at least one customer ID')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const ids = customerIds.split(',').map(id => id.trim()).filter(id => id)
      const response = await axios.post('http://localhost:8080/api/v1/customers', {
        customer_id: ids
      })

      if (response.data.success && response.data.data.length > 0) {
        setCustomers(response.data.data)
        setSelectedCustomer(response.data.data[0])
      } else {
        setError('No customers found')
        setCustomers([])
        setSelectedCustomer(null)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch customer data')
      setCustomers([])
      setSelectedCustomer(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="banking-gradient text-white shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Customer 360</h1>
                <p className="text-blue-100 text-sm">Digital Banking Profile</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Activity className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="container mx-auto px-4 -mt-8">
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2 text-primary" />
              Search Customer Profile
            </CardTitle>
            <CardDescription>
              Enter customer IDs separated by commas (e.g., CUST0000001, CUST0000002)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="Enter Customer ID(s)..."
                value={customerIds}
                onChange={(e) => setCustomerIds(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button 
                onClick={handleSearch} 
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Customer Selection Pills */}
      {customers.length > 0 && (
        <div className="container mx-auto px-4 mt-6">
          <div className="flex flex-wrap gap-2">
            {customers.map((customer) => (
              <button
                key={customer.customer_id}
                onClick={() => setSelectedCustomer(customer)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCustomer?.customer_id === customer.customer_id
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                }`}
              >
                {customer.customer?.personal_info?.full_name || customer.customer_id}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Customer Profile */}
      {selectedCustomer && (
        <div className="container mx-auto px-4 py-6 pb-12">
          <CustomerProfile customer={selectedCustomer} />
        </div>
      )}

      {/* Empty State */}
      {!loading && customers.length === 0 && !error && (
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Customer Selected</h3>
            <p className="text-gray-600">Search for a customer ID to view their 360° profile</p>
          </div>
        </div>
      )}
    </div>
  )
}

function CustomerProfile({ customer }) {
  const {customer: profile, address, contact, accounts, deposits, loans, cards, investments, segment, behavior} = customer

  // Calculate totals
  const totalAccounts = accounts?.length || 0
  const totalBalance = accounts?.reduce((sum, acc) => sum + (acc.balance || 0), 0) || 0
  const totalLoans = loans?.reduce((sum, loan) => sum + (loan.outstanding_balance || 0), 0) || 0
  const totalCards = cards?.reduce((sum, card) => sum + (card.outstanding_balance || 0), 0) || 0
  const totalInvestments = investments?.reduce((sum, inv) => sum + (inv.current_value || 0), 0) || 0

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Profile Header Card */}
      <Card className="border-0 shadow-xl overflow-hidden">
        <div className="banking-gradient p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 backdrop-blur p-4 rounded-xl">
                <User className="w-12 h-12" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-1">
                  {profile?.personal_info?.full_name}
                </h2>
                <p className="text-blue-100 mb-3">
                  {profile?.customer_id} • Customer since {formatDate(profile?.status?.customer_since)}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className={`${getSegmentBadgeColor(profile?.status?.segment)} border`}>
                    <Award className="w-3 h-3 mr-1" />
                    {profile?.status?.segment?.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {profile?.status?.customer_status?.toUpperCase()}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {profile?.personal_info?.age} years old
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm mb-1">Lifetime Value</p>
              <p className="text-2xl font-bold">{formatCurrency(segment?.lifetime_value || 0)}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="text-center">
            <Wallet className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-gray-600">Total Balance</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
          </div>
          <div className="text-center">
            <PiggyBank className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <p className="text-sm text-gray-600">Investments</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(totalInvestments)}</p>
          </div>
          <div className="text-center">
            <Home className="w-6 h-6 mx-auto mb-2 text-orange-600" />
            <p className="text-sm text-gray-600">Loans</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(totalLoans)}</p>
          </div>
          <div className="text-center">
            <CreditCard className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <p className="text-sm text-gray-600">Card Outstanding</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(totalCards)}</p>
          </div>
        </div>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="accounts">Accounts ({totalAccounts})</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="personal" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <User className="w-5 h-5 mr-2 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Full Name" value={profile?.personal_info?.full_name} />
                <InfoRow label="Gender" value={profile?.personal_info?.gender === 'M' ? 'Male' : 'Female'} />
                <InfoRow label="Date of Birth" value={formatDate(profile?.personal_info?.birth_date)} />
                <InfoRow label="Age" value={`${profile?.personal_info?.age} years`} />
                <InfoRow label="Birth Place" value={profile?.personal_info?.birth_place} />
                <InfoRow label="Marital Status" value={profile?.personal_info?.marital_status} />
                <InfoRow label="Religion" value={profile?.personal_info?.religion} />
                <InfoRow label="ID Number" value={profile?.personal_info?.id_number} />
                <InfoRow label="NPWP" value={profile?.personal_info?.npwp || '-'} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Building2 className="w-5 h-5 mr-2 text-primary" />
                  Demographics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Occupation" value={profile?.demographics?.occupation} />
                <InfoRow label="Industry" value={profile?.demographics?.industry} />
                <InfoRow label="Education" value={profile?.demographics?.education} />
                <InfoRow label="Employment Status" value={profile?.demographics?.employment_status} />
                <InfoRow label="Employer" value={profile?.demographics?.employer_name} />
                <InfoRow label="Years Employed" value={`${profile?.demographics?.years_employed} years`} />
                <InfoRow label="Monthly Income" value={formatCurrency(profile?.demographics?.monthly_income)} />
                <InfoRow label="Income Range" value={profile?.demographics?.income_range} />
              </CardContent>
            </Card>
          </div>

          {address && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <MapPin className="w-5 h-5 mr-2 text-primary" />
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Street Address</p>
                    <p className="font-medium">{address.address_line1}</p>
                    {address.address_line2 && <p className="text-sm text-gray-600">{address.address_line2}</p>}
                  </div>
                  <div className="space-y-2">
                    <InfoRow label="City" value={address.city} />
                    <InfoRow label="Province" value={address.province} />
                    <InfoRow label="Postal Code" value={address.postal_code} />
                    <InfoRow label="Residence Type" value={address.residence_type} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Accounts Tab */}
        <TabsContent value="accounts" className="space-y-4">
          {accounts && accounts.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {accounts.map((account, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{account.product_name}</CardTitle>
                        <CardDescription>{account.account_number}</CardDescription>
                      </div>
                      <Badge className={getProductStatusColor(account.account_status)}>
                        {account.account_status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Balance</p>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(account.balance)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <InfoRow label="Type" value={account.account_type} />
                      <InfoRow label="Currency" value={account.currency} />
                      <InfoRow label="Available" value={formatCurrency(account.available_balance)} />
                      <InfoRow label="Interest Rate" value={`${account.interest_rate}%`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState icon={Wallet} message="No accounts found" />
          )}
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          {/* Deposits */}
          {deposits && deposits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PiggyBank className="w-5 h-5 mr-2 text-green-600" />
                  Deposits ({deposits.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deposits.map((deposit, idx) => (
                    <div key={idx} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{deposit.product_name}</p>
                          <p className="text-sm text-gray-600">{deposit.deposit_number}</p>
                        </div>
                        <Badge className={getProductStatusColor(deposit.deposit_status)}>
                          {deposit.deposit_status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <InfoRow label="Principal" value={formatCurrency(deposit.principal_amount)} />
                        <InfoRow label="Interest Rate" value={`${deposit.interest_rate}%`} />
                        <InfoRow label="Tenor" value={`${deposit.tenor_months} months`} />
                        <InfoRow label="Maturity" value={formatDate(deposit.maturity_date)} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loans */}
          {loans && loans.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="w-5 h-5 mr-2 text-orange-600" />
                  Loans ({loans.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loans.map((loan, idx) => (
                    <div key={idx} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{loan.product_name}</p>
                          <p className="text-sm text-gray-600">{loan.loan_number}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getProductStatusColor(loan.loan_status)}>
                            {loan.loan_status}
                          </Badge>
                          {loan.payment_status === 'overdue' && (
                            <Badge className="ml-2 bg-red-100 text-red-800">
                              {loan.dpd} DPD
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <InfoRow label="Outstanding" value={formatCurrency(loan.outstanding_balance)} />
                        <InfoRow label="Monthly Payment" value={formatCurrency(loan.monthly_installment)} />
                        <InfoRow label="Interest Rate" value={`${loan.interest_rate}%`} />
                        <InfoRow label="Remaining" value={`${loan.remaining_months} months`} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cards */}
          {cards && cards.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
                  Cards ({cards.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {cards.map((card, idx) => (
                    <div key={idx} className="card-gradient p-6 rounded-xl text-white shadow-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm opacity-90">{card.card_brand} {card.card_tier}</p>
                          <p className="text-lg font-semibold mt-1">{card.card_number}</p>
                        </div>
                        <Badge className="bg-white/20 text-white border-white/30">
                          {card.card_type}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        {card.credit_limit > 0 && (
                          <>
                            <div className="flex justify-between">
                              <span className="opacity-90">Credit Limit</span>
                              <span className="font-semibold">{formatCurrency(card.credit_limit)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="opacity-90">Outstanding</span>
                              <span className="font-semibold">{formatCurrency(card.outstanding_balance)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="opacity-90">Available</span>
                              <span className="font-semibold">{formatCurrency(card.available_credit)}</span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between pt-2 border-t border-white/20">
                          <span className="opacity-90">Rewards</span>
                          <span className="font-semibold">{formatNumber(card.rewards_balance)} pts</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Investments */}
          {investments && investments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Investments ({investments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {investments.map((inv, idx) => (
                    <div key={idx} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{inv.product_name}</p>
                          <p className="text-sm text-gray-600">{inv.investment_id}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={inv.return_percentage >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {inv.return_percentage >= 0 ? '+' : ''}{inv.return_percentage}%
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <InfoRow label="Initial" value={formatCurrency(inv.initial_investment)} />
                        <InfoRow label="Current" value={formatCurrency(inv.current_value)} />
                        <InfoRow label="Gain/Loss" value={formatCurrency(inv.unrealized_gain_loss)} />
                        <InfoRow label="Type" value={inv.investment_type} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Target className="w-5 h-5 mr-2 text-primary" />
                  Segmentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Current Segment" value={segment?.current_segment?.replace('_', ' ').toUpperCase()} />
                <InfoRow label="Potential Segment" value={segment?.potential_segment?.replace('_', ' ').toUpperCase()} />
                <InfoRow label="Segment Score" value={segment?.segment_score} />
                <InfoRow label="Lifetime Value" value={formatCurrency(segment?.lifetime_value)} />
                <InfoRow label="Profitability Score" value={segment?.profitability_score} />
                <InfoRow label="Churn Risk" value={segment?.churn_risk} />
                <InfoRow label="Churn Score" value={segment?.churn_score} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Activity className="w-5 h-5 mr-2 text-primary" />
                  Product Ownership
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Total Products" value={behavior?.product_ownership?.total_products} />
                <InfoRow label="Accounts" value={behavior?.product_ownership?.accounts} />
                <InfoRow label="Deposits" value={behavior?.product_ownership?.deposits} />
                <InfoRow label="Loans" value={behavior?.product_ownership?.loans} />
                <InfoRow label="Cards" value={behavior?.product_ownership?.cards} />
                <InfoRow label="Investments" value={behavior?.product_ownership?.investments} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Activity className="w-5 h-5 mr-2 text-primary" />
                Engagement Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <InfoRow label="Engagement Score" value={behavior?.engagement?.engagement_score} />
                <InfoRow label="Digital Adoption" value={behavior?.engagement?.digital_adoption?.toUpperCase()} />
                <InfoRow label="Campaign Response" value={`${(behavior?.engagement?.campaign_response_rate * 100).toFixed(0)}%`} />
                <InfoRow label="NPS Score" value={behavior?.engagement?.nps_score} />
                <InfoRow label="Avg Monthly Transactions" value={behavior?.transaction_patterns?.avg_monthly_transactions} />
                <InfoRow label="Avg Transaction Value" value={formatCurrency(behavior?.transaction_patterns?.avg_transaction_value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Phone className="w-5 h-5 mr-2 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow icon={Phone} label="Primary Phone" value={contact?.primary_phone} />
                <InfoRow icon={Phone} label="Secondary Phone" value={contact?.secondary_phone || '-'} />
                <InfoRow icon={Mail} label="Primary Email" value={contact?.email_primary} />
                <InfoRow icon={Mail} label="Secondary Email" value={contact?.email_secondary || '-'} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Activity className="w-5 h-5 mr-2 text-primary" />
                  Communication Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Preferred Channel" value={contact?.communication_preferences?.preferred_channel} />
                <InfoRow label="Preferred Language" value={contact?.communication_preferences?.preferred_language} />
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2">Consents:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <ConsentBadge label="Email" value={contact?.communication_preferences?.email_consent} />
                    <ConsentBadge label="SMS" value={contact?.communication_preferences?.sms_consent} />
                    <ConsentBadge label="WhatsApp" value={contact?.communication_preferences?.whatsapp_consent} />
                    <ConsentBadge label="Marketing" value={contact?.communication_preferences?.marketing_consent} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Behavior Tab */}
        <TabsContent value="behavior" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Activity className="w-5 h-5 mr-2 text-primary" />
                  Channel Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Primary Channel" value={behavior?.channel_usage?.primary_channel} />
                <InfoRow label="Last Mobile Login" value={formatDate(behavior?.channel_usage?.last_mobile_login)} />
                <InfoRow label="Last ATM Usage" value={formatDate(behavior?.channel_usage?.last_atm_usage)} />
                <InfoRow label="Last Branch Visit" value={formatDate(behavior?.channel_usage?.last_branch_visit)} />
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2">Active Channels:</p>
                  <div className="flex flex-wrap gap-2">
                    <ChannelBadge label="Mobile Banking" active={behavior?.channel_usage?.mobile_banking_active} />
                    <ChannelBadge label="Internet Banking" active={behavior?.channel_usage?.internet_banking_active} />
                    <ChannelBadge label="ATM" active={behavior?.channel_usage?.atm_usage} />
                    <ChannelBadge label="Branch" active={behavior?.channel_usage?.branch_visits} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  Transaction Patterns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Avg Monthly Transactions" value={behavior?.transaction_patterns?.avg_monthly_transactions} />
                <InfoRow label="Avg Transaction Value" value={formatCurrency(behavior?.transaction_patterns?.avg_transaction_value)} />
                <InfoRow label="Preferred Type" value={behavior?.transaction_patterns?.preferred_transaction_type} />
                <InfoRow label="Peak Time" value={behavior?.transaction_patterns?.peak_transaction_time} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper Components
function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex justify-between items-start py-1">
      <span className="text-sm text-gray-600 flex items-center">
        {Icon && <Icon className="w-3 h-3 mr-1" />}
        {label}
      </span>
      <span className="text-sm font-medium text-gray-900 text-right ml-2">
        {value || '-'}
      </span>
    </div>
  )
}

function ConsentBadge({ label, value }) {
  return (
    <div className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
      {label}: {value ? '✓' : '✗'}
    </div>
  )
}

function ChannelBadge({ label, active }) {
  return (
    <Badge variant={active ? "default" : "secondary"}>
      {label} {active ? '✓' : '✗'}
    </Badge>
  )
}

function EmptyState({ icon: Icon, message }) {
  return (
    <div className="text-center py-12">
      <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-600">{message}</p>
    </div>
  )
}

export default App
