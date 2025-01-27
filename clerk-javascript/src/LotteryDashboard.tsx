import { UserButton, useUser } from '@clerk/clerk-react'
import { useState } from 'react'

type Lottery = {
  id: string
  name: string
  participants: string[]
  maxParticipants: number
  drawTime: string
  createdBy: string
}

type TicketView = {
  login: number
  name: string
  gemsel: number
  packNumber: number
  packSize: number
  start: number
  end: number
}

export default function LotteryDashboard() {
  const { user } = useUser()
  const [currentView, setCurrentView] = useState<'cards' | 'table'>('cards')
  const [newLottery, setNewLottery] = useState({
    name: '',
    maxParticipants: 10,
    drawTime: ''
  })
  const [lotteries, setLotteries] = useState<Lottery[]>(
    JSON.parse(localStorage.getItem('lotteries') || '[]')
  )

  const mockTicketData: TicketView[] = [
    {
      login: 2588,
      name: 'S400 Million Mega Bucks',
      gemsel: 23736,
      packNumber: 1,
      packSize: 15,
      start: 0,
      end: 0
    },
    {
      login: 2548,
      name: 'Lone',
      gemsel: 12489,
      packNumber: 2,
      packSize: 20,
      start: 9,
      end: 0
    },
    // Add other entries from your screenshot here
  ]

  const createLottery = (e: React.FormEvent) => {
    e.preventDefault()
    const lottery: Lottery = {
      id: Date.now().toString(),
      ...newLottery,
      participants: [],
      createdBy: user?.fullName || 'Anonymous'
    }
    
    const updated = [...lotteries, lottery]
    setLotteries(updated)
    localStorage.setItem('lotteries', JSON.stringify(updated))
    setNewLottery({ name: '', maxParticipants: 10, drawTime: '' })
  }

  const joinLottery = (id: string) => {
    const updated = lotteries.map(l => {
      if (l.id === id && l.participants.length < l.maxParticipants) {
        return { ...l, participants: [...l.participants, user?.fullName || 'User'] }
      }
      return l
    })
    setLotteries(updated)
    localStorage.setItem('lotteries', JSON.stringify(updated))
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🎰 Holiday Lottery System</h1>
        <div className="user-profile">
          <UserButton afterSignOutUrl="/" />
          <span>{user?.fullName}</span>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={currentView === 'cards' ? 'nav-active' : ''}
          onClick={() => setCurrentView('cards')}
        >
          Active Lotteries
        </button>
        <button
          className={currentView === 'table' ? 'nav-active' : ''}
          onClick={() => setCurrentView('table')}
        >
          View Tickets
        </button>
        <button>Past Draws</button>
      </nav>

      <main className="dashboard-main">
        {currentView === 'cards' ? (
          <>
            <section className="create-lottery">
              <h2>🎟️ Create New Lottery</h2>
              <form onSubmit={createLottery}>
                <input
                  type="text"
                  placeholder="Lottery Name"
                  value={newLottery.name}
                  onChange={e => setNewLottery({...newLottery, name: e.target.value})}
                  required
                />
                <input
                  type="number"
                  min="2"
                  max="100"
                  value={newLottery.maxParticipants}
                  onChange={e => setNewLottery({...newLottery, maxParticipants: +e.target.value})}
                  required
                />
                <input
                  type="datetime-local"
                  value={newLottery.drawTime}
                  onChange={e => setNewLottery({...newLottery, drawTime: e.target.value})}
                  required
                />
                <button type="submit">Create Lottery</button>
              </form>
            </section>

            <section className="active-lotteries">
              <h2>🎉 Active Draws ({lotteries.length})</h2>
              <div className="lottery-grid">
                {lotteries.map(lottery => (
                  <div key={lottery.id} className="lottery-card">
                    <h3>{lottery.name}</h3>
                    <div className="lottery-details">
                      <p>🎫 {lottery.participants.length}/{lottery.maxParticipants} tickets</p>
                      <p>⏰ Draw: {new Date(lottery.drawTime).toLocaleString()}</p>
                      <p>👤 Created by: {lottery.createdBy}</p>
                    </div>
                    <button 
                      onClick={() => joinLottery(lottery.id)}
                      disabled={lottery.participants.length >= lottery.maxParticipants}
                    >
                      {lottery.participants.length >= lottery.maxParticipants ? 
                        'FULL' : 'Join Now ($5)'}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="ticket-view">
            <div className="view-controls">
              <div className="action-group">
                <button className="action-btn">Delete</button>
                <button className="action-btn">Print</button>
                <button className="action-btn">Send it</button>
                <button className="action-btn">Save</button>
                <button className="action-btn">Add Out</button>
              </div>
              <div className="search-box">
                <input type="text" placeholder="Search..." />
              </div>
            </div>

            <table className="lottery-table">
              <thead>
                <tr>
                  <th>Login</th>
                  <th>Name</th>
                  <th>Gemsel</th>
                  <th>Pack #</th>
                  <th>Pack Size</th>
                  <th>Start</th>
                  <th>End</th>
                </tr>
              </thead>
              <tbody>
                {mockTicketData.map((ticket) => (
                  <tr key={ticket.name}>
                    <td>{ticket.login}</td>
                    <td>{ticket.name}</td>
                    <td>{ticket.gemsel}</td>
                    <td>{ticket.packNumber}</td>
                    <td>{ticket.packSize}</td>
                    <td>{ticket.start}</td>
                    <td>{ticket.end}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="sales-summary">
              <h3>Sales Summary</h3>
              <div className="summary-content">
                <p>Current Sales: $128</p>
                <button className="adjust-btn">Adjust Amounts</button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}