import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>&copy; 2025 Revory. All rights reserved.</p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#222',
    color: '#aaa',
    padding: '1rem',
    textAlign: 'center',
    marginTop: 'auto'
  }
};

export default Footer;
