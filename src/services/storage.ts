import type { Empresa, Funcionario, Sala, Reserva } from '../types'

// Chaves para LocalStorage
const STORAGE_KEYS = {
  EMPRESAS: 'condominio_empresas',
  FUNCIONARIOS: 'condominio_funcionarios',
  SALAS: 'condominio_salas',
  RESERVAS: 'condominio_reservas'
}

// Função genérica para obter dados do LocalStorage
function getFromStorage<T>(key: string, defaultValue: T[]): T[] {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : defaultValue
  } catch (error) {
    console.error(`Erro ao ler dados de ${key}:`, error)
    return defaultValue
  }
}

// Função genérica para salvar dados no LocalStorage
function saveToStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Erro ao salvar dados em ${key}:`, error)
  }
}

// Função para gerar ID único
function generateId(items: any[]): number {
  return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1
}

// ===== SERVIÇOS PARA EMPRESAS =====
export const empresaService = {
  getAll(): Empresa[] {
    return getFromStorage(STORAGE_KEYS.EMPRESAS, [])
  },

  getById(id: number): Empresa | undefined {
    const empresas = this.getAll()
    return empresas.find(empresa => empresa.id === id)
  },

  create(empresa: Omit<Empresa, 'id'>): Empresa {
    const empresas = this.getAll()
    const novaEmpresa: Empresa = {
      ...empresa,
      id: generateId(empresas)
    }
    empresas.push(novaEmpresa)
    saveToStorage(STORAGE_KEYS.EMPRESAS, empresas)
    return novaEmpresa
  },

  update(id: number, empresa: Omit<Empresa, 'id'>): Empresa | null {
    const empresas = this.getAll()
    const index = empresas.findIndex(e => e.id === id)
    if (index === -1) return null

    empresas[index] = { ...empresa, id }
    saveToStorage(STORAGE_KEYS.EMPRESAS, empresas)
    return empresas[index]
  },

  delete(id: number): boolean {
    const empresas = this.getAll()
    const index = empresas.findIndex(e => e.id === id)
    if (index === -1) return false

    empresas.splice(index, 1)
    saveToStorage(STORAGE_KEYS.EMPRESAS, empresas)
    return true
  }
}

// ===== SERVIÇOS PARA FUNCIONÁRIOS =====
export const funcionarioService = {
  getAll(): Funcionario[] {
    const funcionarios = getFromStorage<Omit<Funcionario, 'empresa'>>(STORAGE_KEYS.FUNCIONARIOS, [])
    const empresas = empresaService.getAll()
    
    // Adicionar dados da empresa para cada funcionário
    return funcionarios.map(funcionario => ({
      ...funcionario,
      empresa: empresas.find(empresa => empresa.id === funcionario.empresa_id)
    }))
  },

  getById(id: number): Funcionario | undefined {
    const funcionarios = this.getAll()
    return funcionarios.find(funcionario => funcionario.id === id)
  },

  create(funcionario: Omit<Funcionario, 'id' | 'empresa'>): Funcionario {
    const funcionarios = getFromStorage<Omit<Funcionario, 'empresa'>>(STORAGE_KEYS.FUNCIONARIOS, [])
    const novoFuncionario: Omit<Funcionario, 'empresa'> = {
      ...funcionario,
      id: generateId(funcionarios)
    }
    funcionarios.push(novoFuncionario)
    saveToStorage(STORAGE_KEYS.FUNCIONARIOS, funcionarios)
    
    // Retornar com dados da empresa
    return this.getById(novoFuncionario.id)!
  },

  update(id: number, funcionario: Omit<Funcionario, 'id' | 'empresa'>): Funcionario | null {
    const funcionarios = getFromStorage<Omit<Funcionario, 'empresa'>>(STORAGE_KEYS.FUNCIONARIOS, [])
    const index = funcionarios.findIndex(f => f.id === id)
    if (index === -1) return null

    funcionarios[index] = { ...funcionario, id }
    saveToStorage(STORAGE_KEYS.FUNCIONARIOS, funcionarios)
    
    // Retornar com dados da empresa
    return this.getById(id) || null
  },

  delete(id: number): boolean {
    const funcionarios = getFromStorage<Omit<Funcionario, 'empresa'>>(STORAGE_KEYS.FUNCIONARIOS, [])
    const index = funcionarios.findIndex(f => f.id === id)
    if (index === -1) return false

    funcionarios.splice(index, 1)
    saveToStorage(STORAGE_KEYS.FUNCIONARIOS, funcionarios)
    return true
  },

  getByEmpresa(empresaId: number): Funcionario[] {
    return this.getAll().filter(f => f.empresa_id === empresaId)
  }
}

// ===== SERVIÇOS PARA SALAS =====
export const salaService = {
  getAll(): Sala[] {
    return getFromStorage(STORAGE_KEYS.SALAS, [])
  },

  getById(id: number): Sala | undefined {
    const salas = this.getAll()
    return salas.find(sala => sala.id === id)
  },

  create(sala: Omit<Sala, 'id'>): Sala {
    const salas = this.getAll()
    const novaSala: Sala = {
      ...sala,
      id: generateId(salas)
    }
    salas.push(novaSala)
    saveToStorage(STORAGE_KEYS.SALAS, salas)
    return novaSala
  },

  update(id: number, sala: Omit<Sala, 'id'>): Sala | null {
    const salas = this.getAll()
    const index = salas.findIndex(s => s.id === id)
    if (index === -1) return null

    salas[index] = { ...sala, id }
    saveToStorage(STORAGE_KEYS.SALAS, salas)
    return salas[index]
  },

  delete(id: number): boolean {
    const salas = this.getAll()
    const index = salas.findIndex(s => s.id === id)
    if (index === -1) return false

    salas.splice(index, 1)
    saveToStorage(STORAGE_KEYS.SALAS, salas)
    return true
  }
}

// ===== SERVIÇOS PARA RESERVAS =====
export const reservaService = {
  getAll(): Reserva[] {
    const reservas = getFromStorage<Omit<Reserva, 'funcionario' | 'sala'>>(STORAGE_KEYS.RESERVAS, [])
    const funcionarios = funcionarioService.getAll()
    const salas = salaService.getAll()
    
    // Adicionar dados do funcionário e sala para cada reserva
    return reservas.map(reserva => ({
      ...reserva,
      funcionario: funcionarios.find(f => f.id === reserva.funcionario_id),
      sala: salas.find(s => s.id === reserva.sala_id)
    }))
  },

  getById(id: number): Reserva | undefined {
    const reservas = this.getAll()
    return reservas.find(reserva => reserva.id === id)
  },

  create(reserva: Omit<Reserva, 'id' | 'funcionario' | 'sala'>): Reserva {
    const reservas = getFromStorage<Omit<Reserva, 'funcionario' | 'sala'>>(STORAGE_KEYS.RESERVAS, [])
    const novaReserva: Omit<Reserva, 'funcionario' | 'sala'> = {
      ...reserva,
      id: generateId(reservas)
    }
    reservas.push(novaReserva)
    saveToStorage(STORAGE_KEYS.RESERVAS, reservas)
    
    // Retornar com dados do funcionário e sala
    return this.getById(novaReserva.id)!
  },

  update(id: number, reserva: Omit<Reserva, 'id' | 'funcionario' | 'sala'>): Reserva | null {
    const reservas = getFromStorage<Omit<Reserva, 'funcionario' | 'sala'>>(STORAGE_KEYS.RESERVAS, [])
    const index = reservas.findIndex(r => r.id === id)
    if (index === -1) return null

    reservas[index] = { ...reserva, id }
    saveToStorage(STORAGE_KEYS.RESERVAS, reservas)
    
    // Retornar com dados do funcionário e sala
    return this.getById(id) || null
  },

  delete(id: number): boolean {
    const reservas = getFromStorage<Omit<Reserva, 'funcionario' | 'sala'>>(STORAGE_KEYS.RESERVAS, [])
    const index = reservas.findIndex(r => r.id === id)
    if (index === -1) return false

    reservas.splice(index, 1)
    saveToStorage(STORAGE_KEYS.RESERVAS, reservas)
    return true
  },

  getBySala(salaId: number): Reserva[] {
    return this.getAll().filter(r => r.sala_id === salaId)
  },

  getByFuncionario(funcionarioId: number): Reserva[] {
    return this.getAll().filter(r => r.funcionario_id === funcionarioId)
  },

  getByData(data: string): Reserva[] {
    return this.getAll().filter(r => r.data === data)
  },

  // Verificar conflitos de horário para uma sala
  hasConflict(salaId: number, data: string, horarioInicio: string, horarioFim: string, excludeId?: number): boolean {
    const reservas = this.getAll().filter(r => 
      r.sala_id === salaId && 
      r.data === data && 
      r.id !== excludeId
    )

    return reservas.some(reserva => {
      const inicioExistente = reserva.horario_inicio
      const fimExistente = reserva.horario_fim
      
      // Verificar se há sobreposição de horários
      return (horarioInicio < fimExistente && horarioFim > inicioExistente)
    })
  }
}
