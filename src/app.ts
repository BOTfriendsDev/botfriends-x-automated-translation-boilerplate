import cors from 'cors'
import helmet from 'helmet'
import express, { Request, Response } from 'express'
import routes from './routes'
import { Server } from 'http'

class App {
    public app: express.Application
    private port: string

    constructor() {
        this.app = express()
        this.port = process.env.PORT || '8080'
    }

    public startServer(): Server {
        this.initializeMiddlewares()
        this.initializeControllers()
        this.initializeErrorHandling()
        return this.app.listen(this.port, () => {
            console.group('App Details')
            console.log('###########################################################################')
            console.log('Server StartTime: %s', new Date().toISOString())
            console.log('ServiceName: %s', process.env.npm_package_name)
            console.log('App listening on the port: %s', this.port)
            console.log('Version: %s', process.env.npm_package_version)
            console.log('Press CTRL+C to stop the server')
            console.log('###########################################################################')
            console.groupEnd() 
        })
    }

    private initializeMiddlewares(): void {
        this.app.use(cors())
        this.app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }))
        this.app.use(express.urlencoded({ limit: '20mb', extended: true }))
        this.app.use(express.json({ limit: '20mb' }))
    }

    private async initializeErrorHandling(): Promise<void> {
        this.app.use((req, res) => {
            return res.status(404).send({ message: 'Route' + req.url + ' Not found.' })
        })
        this.app.use((err: Error, _req: Request, res: Response) => {
            return res.status(500).json({
                status: 'error',
                message: err.message,
            })
        })
    }

    private async initializeControllers(): Promise<void> {
        this.app.use('/api/v1', routes())
    }
}

export default App
