import './App.css'

function App() {
  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">Club Rapid</div>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#about">About</a></li>
          <li><button className="btn-login">Login</button></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <h1>Accelerate Your Passion with <span className="highlight">Club Rapid</span></h1>
        <p>함께 성장하고, 빠르게 결과물을 만들어내는 동아리입니다.</p>
        <div className="hero-btns">
          <button className="btn-primary">가입 신청하기</button>
          <button className="btn-secondary">더 알아보기</button>
        </div>
      </header>

      {/* Features Preview */}
      <section id="features" className="features-section">
        <h2>Our Main Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>동적 네비게이션</h3>
            <p>언제 어디서든 원하는 메뉴로 빠르게 이동하세요.</p>
          </div>
          <div className="feature-card">
            <h3>실시간 채팅</h3>
            <p>팀원들과 즉각적으로 소통하고 아이디어를 공유합니다.</p>
          </div>
          <div className="feature-card">
            <h3>관리자 페이지</h3>
            <p>동아리 운영을 위한 체계적인 관리 도구를 제공합니다.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2026 Club Rapid. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App

// Original code preserved below as per instructions:
// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'
// 
// function App() {
//   const [count, setCount] = useState(0)
// 
//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           type="button"
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>
// 
//       <div className="ticks"></div>
// 
//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>
// 
//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }
// 
// export default App
