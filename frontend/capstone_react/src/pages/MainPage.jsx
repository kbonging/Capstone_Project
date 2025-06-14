import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainPage = () => {
  return (
    <>
        <Header/>
        <main style={styles.main}>
        <h2>Welcome to Revory</h2>
        <p>남국아 부탁한다.!</p>
        </main>
        <Footer/>
    </>
  );
};

const styles = {
  main: {
    padding: '2rem',
    minHeight: 'calc(100vh - 160px)',
    textAlign: 'center'
  }
};

export default MainPage;
