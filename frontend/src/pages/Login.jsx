import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/logare', { email, password });
      
      //Verificare daca login
      console.log('Login reușit:', res.data);

      const user = res.data.angajat;
      const rolUser = user.rol;
      localStorage.setItem('user', JSON.stringify(res.data.angajat));
      localStorage.setItem('role', JSON.stringify(rolUser));

      setError('');
      if(rolUser === 'admin') navigate('/adminDashboard')
      else navigate('/employeeDashboard');
    } catch (err) {
      console.error('Eroare login:', err.response?.data);
      setError(err.response?.data?.message || 'Eroare la login');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
        padding: '48px',
        width: '100%',
        maxWidth: '450px'
      }}>
       
        <div style={{
          width: '120px',
          height: '120px',
          margin: '0 auto 32px',
          backgroundColor: '#f3f4f6',
          borderRadius: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: '3px solid #e5e7eb'
        }}>
          {
              <img src="/logo_caffe.png" alt="Coffee" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius:0 }} />}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '8px' 
          }}>
            VintHUB Coffe
          </h1>
          <p style={{ color: '#6b7280' }}>Fiecare ceașcă de cafea ascunde o poveste.</p>
          {error && (
            <div style={{ 
              color: '#dc2626', 
              marginTop: '12px',
              backgroundColor: '#fee2e2',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label 
              htmlFor="email" 
              style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '8px' 
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="exemplu@email.com"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '8px' 
              }}
            >
              Parolă
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            fontSize: '14px' 
          }}>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #523e1eff 0%, #b15c1bff 100%)',
              color: 'white',
              fontWeight: '600',
              padding: '14px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 10px 20px rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Conectare
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;