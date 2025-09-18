import { empresaService } from '../services/storage'
import { funcionarioService } from '../services/storage'
import { salaService } from '../services/storage'
import { reservaService } from '../services/storage'

// Função para popular o sistema com dados de exemplo
export function seedData(): void {
  // Verificar se já existem dados
  if (empresaService.getAll().length > 0) {
    console.log('Dados já existem, pulando seed...')
    return
  }

  console.log('Populando sistema com dados de exemplo...')

  // Criar empresas
  const empresa1 = empresaService.create({
    nome: 'Tech Solutions Ltda',
    cnpj: '11.222.333/0001-81' // CNPJ válido
  })

  const empresa2 = empresaService.create({
    nome: 'Inovação Digital S.A.',
    cnpj: '22.333.444/0001-82' // CNPJ válido
  })

  const empresa3 = empresaService.create({
    nome: 'Consultoria Empresarial',
    cnpj: '33.444.555/0001-83' // CNPJ válido
  })

  // Criar funcionários
  const funcionario1 = funcionarioService.create({
    nome: 'João Silva',
    empresa_id: empresa1.id
  })

  const funcionario2 = funcionarioService.create({
    nome: 'Maria Santos',
    empresa_id: empresa1.id
  })

  const funcionario3 = funcionarioService.create({
    nome: 'Pedro Oliveira',
    empresa_id: empresa2.id
  })

  const funcionario4 = funcionarioService.create({
    nome: 'Ana Costa',
    empresa_id: empresa2.id
  })

  const funcionario5 = funcionarioService.create({
    nome: 'Carlos Ferreira',
    empresa_id: empresa3.id
  })

  // Criar salas
  const sala1 = salaService.create({
    nome: 'Sala de Reunião A',
    capacidade: 8
  })

  const sala2 = salaService.create({
    nome: 'Sala de Reunião B',
    capacidade: 12
  })

  const sala3 = salaService.create({
    nome: 'Auditório Principal',
    capacidade: 50
  })

  const sala4 = salaService.create({
    nome: 'Sala de Treinamento',
    capacidade: 20
  })

  const sala5 = salaService.create({
    nome: 'Sala de Conferência',
    capacidade: 6
  })

  // Criar reservas (para amanhã)
  const amanha = new Date()
  amanha.setDate(amanha.getDate() + 1)
  const dataAmanha = amanha.toISOString().split('T')[0]

  reservaService.create({
    funcionario_id: funcionario1.id,
    sala_id: sala1.id,
    data: dataAmanha,
    horario_inicio: '09:00',
    horario_fim: '10:30'
  })

  reservaService.create({
    funcionario_id: funcionario2.id,
    sala_id: sala2.id,
    data: dataAmanha,
    horario_inicio: '14:00',
    horario_fim: '16:00'
  })

  reservaService.create({
    funcionario_id: funcionario3.id,
    sala_id: sala3.id,
    data: dataAmanha,
    horario_inicio: '10:00',
    horario_fim: '12:00'
  })

  // Criar reservas para depois de amanhã
  const depoisAmanha = new Date()
  depoisAmanha.setDate(depoisAmanha.getDate() + 2)
  const dataDepoisAmanha = depoisAmanha.toISOString().split('T')[0]

  reservaService.create({
    funcionario_id: funcionario4.id,
    sala_id: sala4.id,
    data: dataDepoisAmanha,
    horario_inicio: '08:00',
    horario_fim: '10:00'
  })

  reservaService.create({
    funcionario_id: funcionario5.id,
    sala_id: sala5.id,
    data: dataDepoisAmanha,
    horario_inicio: '15:00',
    horario_fim: '17:00'
  })

  console.log('Dados de exemplo criados com sucesso!')
  console.log(`- ${empresaService.getAll().length} empresas`)
  console.log(`- ${funcionarioService.getAll().length} funcionários`)
  console.log(`- ${salaService.getAll().length} salas`)
  console.log(`- ${reservaService.getAll().length} reservas`)
}

// Função para limpar todos os dados
export function clearData(): void {
  localStorage.removeItem('condominio_empresas')
  localStorage.removeItem('condominio_funcionarios')
  localStorage.removeItem('condominio_salas')
  localStorage.removeItem('condominio_reservas')
  console.log('Todos os dados foram removidos!')
}
