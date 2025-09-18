export interface Empresa {
  id: number
  nome: string
  cnpj: string
}

export interface Funcionario {
  id: number
  nome: string
  empresa_id: number
  empresa?: Empresa
}

export interface Sala {
  id: number
  nome: string
  capacidade: number
}

export interface Reserva {
  id: number
  funcionario_id: number
  sala_id: number
  data: string
  horario_inicio: string
  horario_fim: string
  funcionario?: Funcionario
  sala?: Sala
}

export interface FormErrors {
  [key: string]: string[]
}
