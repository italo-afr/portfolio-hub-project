import { Component } from 'react'

/**
 * Isola falhas do mini-app: se ele quebrar, a moldura e o resto da página
 * continuam de pé em vez de derrubar a árvore inteira do React.
 *
 * Precisa ser class component — React ainda não oferece error boundary em hooks.
 */
export default class MiniAppBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  handleRetry = () => this.setState({ error: null })

  render() {
    const { error } = this.state

    if (error) {
      return (
        <div className="grid place-items-center px-6 py-20 text-center">
          <p className="font-mono text-xs tracking-[0.2em] text-danger uppercase">
            Erro no mini-app
          </p>
          <p className="mt-3 max-w-md text-sm text-mist-500">
            Algo quebrou ao executar esta aplicação. O restante do portfólio
            segue funcionando normalmente.
          </p>
          <p className="mt-3 max-w-md font-mono text-xs break-words text-mist-600">
            {error.message}
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="mt-6 rounded-lg border border-line px-4 py-2 text-sm font-semibold text-mist-100 transition hover:bg-surface-2"
          >
            Tentar de novo
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
