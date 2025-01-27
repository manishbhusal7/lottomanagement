import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import LotteryDashboard from './LotteryDashboard'

function App() {
  return (
    <ClerkProvider publishableKey="pk_test_aGVscGVkLWR1Y2tsaW5nLTMxLmNsZXJrLmFjY291bnRzLmRldiQ">
      <SignedIn>
        <LotteryDashboard />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  )
}

export default App