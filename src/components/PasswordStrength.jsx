import React from 'react';
import '../css/password-strength.css';

const PasswordStrength = ({ password }) => {
  const calculateStrength = (password) => {
    if (!password) return 0;
    
    let score = 0;
    
    // Длина пароля
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    
    // Наличие заглавных букв
    if (/[A-Z]/.test(password)) score += 1;
    
    // Наличие цифр
    if (/[0-9]/.test(password)) score += 1;
    
    // Наличие специальных символов
    if (/[!.-]/.test(password)) score += 1;
    
    return Math.min(score, 5);
  };

  const getStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return { text: 'Очень слабый', color: '#ff4444' };
      case 2:
        return { text: 'Слабый', color: '#ff8800' };
      case 3:
        return { text: 'Средний', color: '#ffaa00' };
      case 4:
        return { text: 'Хороший', color: '#00aa00' };
      case 5:
        return { text: 'Отличный', color: '#008800' };
      default:
        return { text: 'Очень слабый', color: '#ff4444' };
    }
  };

  const strength = calculateStrength(password);
  const strengthInfo = getStrengthText(strength);

  return (
    <div className="password-strength">
      <div className="strength-bars">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`strength-bar ${strength >= level ? 'active' : ''}`}
            style={{
              backgroundColor: strength >= level ? strengthInfo.color : 'var(--gray-200)'
            }}
          />
        ))}
      </div>
      <span className="strength-text" style={{ color: strengthInfo.color }}>
        {strengthInfo.text}
      </span>
    </div>
  );
};

export default PasswordStrength;
