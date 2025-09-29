import { useState } from 'react'
import { Crown, Check, X, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react'

export default function PremiumUpgrade({ show, onClose, onUpgrade }) {
  const [selectedPlan, setSelectedPlan] = useState('pro')

  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 'Grátis',
      period: '',
      description: 'Para experimentar o FitTracker',
      features: [
        '3 treinos personalizados',
        'IA básica para exercícios',
        'Cronômetro simples',
        'Progresso básico (7 dias)',
        'Suporte por email'
      ],
      limitations: [
        'Máximo 3 treinos',
        'Histórico limitado',
        'Sem análises avançadas',
        'Anúncios'
      ],
      buttonText: 'Plano Atual',
      buttonClass: 'btn-secondary',
      disabled: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 'R$ 19,90',
      period: '/mês',
      description: 'Para atletas sérios',
      popular: true,
      features: [
        'Treinos ilimitados com IA',
        'IA avançada personalizada',
        'Análise de progresso completa',
        'Histórico completo ilimitado',
        'Múltiplos cronômetros',
        'Dashboard de performance',
        'Estatísticas detalhadas',
        'Backup automático na nuvem',
        'Suporte prioritário',
        'Sem anúncios'
      ],
      buttonText: 'Escolher Pro',
      buttonClass: 'btn-primary',
      savings: 'Mais popular'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 'R$ 29,90',
      period: '/mês',
      description: 'Para profissionais do fitness',
      features: [
        'Tudo do Pro +',
        'IA coaching personalizada',
        'Planos nutricionais',
        'Integração com wearables',
        'Relatórios profissionais',
        'API para personal trainers',
        'Consultoria mensal inclusa',
        'White-label disponível'
      ],
      buttonText: 'Escolher Premium',
      buttonClass: 'btn-premium',
      savings: 'Para profissionais'
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
              <h2>Upgrade para FitTracker Pro</h2>
              <p>Desbloqueie todo o potencial do seu treino</p>
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

                  {plan.limitations && (
                    <div className="plan-limitations">
                      <h5>Limitações:</h5>
                      <ul>
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="limitation">
                            <X size={16} className="x-icon" />
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
              disabled={selectedPlan === 'basic'}
            >
              <Crown size={20} />
              Fazer Upgrade Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}