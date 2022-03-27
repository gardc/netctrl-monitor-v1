package errors

// GlobalErrChan is a channel for receiving errors that happen in the app.
var GlobalErrChan = make(chan AppError)

type AppError struct {
	Error string `json:"error"`
	Fatal bool   `json:"fatal"`
}

func HandleError(err error) {
	GlobalErrChan <- AppError{
		Error: err.Error(),
		Fatal: false,
	}
}

func HandleFatalError(err error) {
	GlobalErrChan <- AppError{
		Error: err.Error(),
		Fatal: true,
	}
}
