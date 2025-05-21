import React from 'react';

const Header = () => {
  return (
    <header style={styles.header}>
      <h1 style={styles.logo}>Revory</h1>
      <nav style={styles.nav}>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#66ccff'  // Revory 스타일 컬러 (예시)
  },
  nav: {
    display: 'flex',
    gap: '1rem'
  }
};

export default Header;
