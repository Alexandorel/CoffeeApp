import React, { useState} from 'react'
import Header from '../components/Header'
import MeniuBauturi from '../components/MeniuBauturi'

function Home() {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log("Angajat logat:", user);

  const [comandaCurenta, setComandaCurenta] = useState({
  bautura: null,
  dimensiune: null,
  boabe: null,
  cantitate: 1
});



  return (
    <>
    <Header/>
    <div className="container align-items-center justify-content-center min-vh-100 border border-secundary rounded mt-4"
        >
    
      <div class="container rounded bg-light">
        <div class="row">
        <div class="col-8 border border-secundary rounded">
            <MeniuBauturi/>
        </div>
        <div class="col border border-secundary rounded">
            <button type="button" class="btn btn-outline-secondary mt-2">Adaugare Client</button>
       </div>
  </div>
</div>
    </div>
  </>
  )
}

export default Home