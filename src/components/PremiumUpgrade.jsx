import { useState } from 'react'
import { Crown, Check, X, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react'

export default function PremiumUpgrade({ show, onClose, onUpgrade }) {
  const [selectedPlan, setSelectedPlan] = useState('premium')

  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 'R$ 9,90',
      period: '/mês',
      description: 'Porta de entrada para treinos com IA',
      features: [
        '1 renovação de treino/mês',
        '5 sugestões de IA/mês',
        'Histórico de 30 dias',
        'Backup na nuvem',
        'Cronômetro de descanso',
        'Progresso básico'
      ],
      buttonText: 'Assinar Básico',
      buttonClass: 'btn-secondary'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 'R$ 14,90',
      period: '/mês',
      description: 'Tudo que você precisa para treinar sério',
      popular: true,
      features: [
        '2 treinos novos/semana',
        '10 fotos de equipamentos/treino',
        '3 sugestões de IA/dia',
        'Histórico ilimitado',
        'Backup automático na nuvem',
        'Análise de progresso avançada',
        'Gráficos de evolução',
        'Sistema de conquistas completo'
      ],
      buttonText: 'Assinar Premium',
      buttonClass: 'btn-primary',
      savings: 'Mais Popular'
    },
    {
      id: 'annual',
      name: 'Anual',
      price: 'R$ 119,90',
      period: '/ano',
      pricePerMonth: 'R$ 9,99/mês',
      description: 'Melhor custo-benefício',
      features: [
        'Todos recursos Premium',
        '2 treinos novos/semana',
        '10 fotos de equipamentos/treino',
        '3 sugestões de IA/dia',
        'Histórico ilimitado',
        'Suporte prioritário',
        'Economia de 33%',
        'Menos que 1 mês de academia'
      ],
      buttonText: 'Assinar Anual',
      buttonClass: 'btn-primary',
      savings: 'Economize R$ 58,90'
    }
  ]

  if (!show) return null

  const selectedPlanData = plans.find(p => p.id === selectedPlan)

  return (
    <div className="modal show">
      <div className="modal-content premium-modal">
        <div className="premium-header">
          <div className="premium-title">
            <Crown className="premium-icon" />
            <div>
              <h2>Escolha seu Plano</h2>
              <p>Treinos personalizados com IA a partir de R$ 9,90/mês</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="premium-benefits">
          <h3>🚀 Por que fazer upgrade?</h3>
          <div className="benefits-grid">
            <div className="benefit-item">
              <Sparkles className="benefit-icon" />
              <div>
                <h4>IA Avançada</h4>
                <p>Treinos infinitamente personalizados</p>
              </div>
            </div>
            <div className="benefit-item">
              <TrendingUp className="benefit-icon" />
              <div>
                <h4>Analytics Profissionais</h4>
                <p>Relatórios detalhados de evolução</p>
              </div>
            </div>
            <div className="benefit-item">
              <Shield className="benefit-icon" />
              <div>
                <h4>Backup Seguro</h4>
                <p>Seus dados sempre protegidos</p>
              </div>
            </div>
            <div className="benefit-item">
              <Zap className="benefit-icon" />
              <div>
                <h4>Performance Superior</h4>
                <p>App mais rápido e recursos exclusivos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="premium-plans">
          <div className="plans-grid">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`plan-card ${plan.id === selectedPlan ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
                onClick={() => !plan.disabled && setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="plan-badge">
                    <Crown size={16} />
                    Mais Popular
                  </div>
                )}

                <div className="plan-header">
                  <h4>{plan.name}</h4>
                  <div className="plan-price">
                    <span className="price">{plan.price}</span>
                    <span className="period">{plan.period}</span>
                  </div>
                  {plan.pricePerMonth && (
                    <div className="plan-price-detail">{plan.pricePerMonth}</div>
                  )}
                  <p className="plan-description">{plan.description}</p>
                </div>

                <div className="plan-features">
                  <ul>
                    {plan.features.map((feature, index) => (
                      <li key={index}>
                        <Check size={16} className="check-icon" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                </div>

                <button
                  className={`plan-button ${plan.buttonClass}`}
                  disabled={plan.disabled}
                  onClick={() => !plan.disabled && onUpgrade(plan.id)}
                >
                  {plan.buttonText}
                </button>

                {plan.savings && (
                  <div className="plan-savings">{plan.savings}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="premium-footer">
          <div className="guarantee">
            <Shield size={20} />
            <div>
              <strong>Garantia de 7 dias</strong>
              <p>Não gostou? Cancelamento sem complicações</p>
            </div>
          </div>

          <div className="premium-actions">
            <button className="btn-secondary" onClick={onClose}>
              Talvez depois
            </button>
            <button
              className="btn-primary large"
              onClick={() => onUpgrade(selectedPlan)}
            >
              <Crown size={20} />
              Assinar {selectedPlanData?.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}