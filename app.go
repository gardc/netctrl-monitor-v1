package main

import (
	"changeme/identification"
	"context"
	"fmt"
)

// App struct
type App struct {
	ctx context.Context
	JWT string
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (b *App) startup(ctx context.Context) {
	// Perform your setup here
	b.ctx = ctx
}

// domReady is called after the front-end dom has been loaded
func (b *App) domReady(ctx context.Context) {
	// Add your action here
}

// shutdown is called at application termination
func (b *App) shutdown(ctx context.Context) {
	// Perform your teardown here
}

// Greet returns a greeting for the given name
func (b *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// Machine identification:

func (b *App) GetOS() string {
	return identification.GetOS()
}

func (b *App) GetMachineID() string {
	return identification.GetMachineID()
}

func (b *App) GetMachineHostname() string {
	return identification.GetMachineHostname()
}
