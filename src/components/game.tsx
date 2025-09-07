"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GameState {
  player: {
    x: number
    y: number
    health: number
    maxHealth: number
    gold: number
    weapon: string
    armor: string
    inventory: Array<{
      id: string
      type: string
      name: string
      value?: number
      damage?: number
      defense?: number
    }>
  }
  camera: {
    x: number
    y: number
  }
  level: number
  enemies: Array<{
    id: number
    x: number
    y: number
    health: number
    maxHealth: number
    type: string
    lastMoveTime: number
  }>
  treasures: Array<{
    id: number
    x: number
    y: number
    type: string
    value: number
  }>
  walls: Array<{
    x: number
    y: number
  }>
  lockedDoors: Array<{
    id: number
    x: number
    y: number
    keyId: string
    isOpen: boolean
  }>
  exploredTiles: Set<string>
  exit: {
    x: number
    y: number
  }
  gameStarted: boolean
  gameWon: boolean
  showInventory: boolean
  levelComplete: boolean
  combatState: {
    active: boolean
    enemy: any
    playerTurn: boolean
  }
}

const TILE_SIZE = 32
const WORLD_WIDTH = 1600
const WORLD_HEIGHT = 1200
const VISION_RADIUS = 3 // tiles

// Weapon stats
const WEAPONS = {
  whip: { damage: 15, name: "Whip" },
  sword: { damage: 25, name: "Iron Sword" },
  axe: { damage: 35, name: "Battle Axe" },
  mace: { damage: 30, name: "War Mace" },
  enchanted_sword: { damage: 45, name: "Enchanted Blade" },
}

// Armor stats
const ARMOR = {
  none: { defense: 0, name: "No Armor" },
  leather: { defense: 5, name: "Leather Armor" },
  chainmail: { defense: 10, name: "Chainmail" },
  plate: { defense: 15, name: "Plate Armor" },
  enchanted_plate: { defense: 20, name: "Enchanted Plate" },
}

// Define dungeon level layouts
const dungeonLayouts = [
  // Level 1-2: Simple linear dungeon (scaled up)
  {
    chambers: [
      { name: "entrance", x: 2, y: 15, width: 8, height: 6 },
      { name: "corridor1", x: 10, y: 17, width: 12, height: 3 },
      { name: "treasure_room", x: 22, y: 12, width: 8, height: 8 },
      { name: "monster_den", x: 15, y: 8, width: 8, height: 6 },
      { name: "armory", x: 30, y: 10, width: 6, height: 6 },
      { name: "locked_vault", x: 25, y: 20, width: 6, height: 6 },
      { name: "exit_chamber", x: 35, y: 15, width: 6, height: 6 },
    ],
    connections: [
      { from: "entrance", to: "corridor1" },
      { from: "corridor1", to: "treasure_room" },
      { from: "corridor1", to: "monster_den" },
      { from: "treasure_room", to: "armory" },
      { from: "armory", to: "exit_chamber" },
    ],
    vaultConnections: [{ from: "treasure_room", to: "locked_vault" }],
  },
  // Level 3-4: Branching dungeon (scaled up)
  {
    chambers: [
      { name: "entrance", x: 2, y: 18, width: 6, height: 6 },
      { name: "main_hall", x: 12, y: 15, width: 12, height: 8 },
      { name: "north_chamber", x: 15, y: 4, width: 8, height: 8 },
      { name: "south_chamber", x: 15, y: 26, width: 8, height: 6 },
      { name: "treasure_vault", x: 28, y: 12, width: 6, height: 10 },
      { name: "guard_room", x: 8, y: 4, width: 6, height: 6 },
      { name: "armory", x: 26, y: 4, width: 6, height: 6 },
      { name: "healing_chamber", x: 6, y: 26, width: 6, height: 6 },
      { name: "locked_vault1", x: 35, y: 8, width: 6, height: 6 },
      { name: "locked_vault2", x: 2, y: 8, width: 6, height: 6 },
      { name: "exit_chamber", x: 38, y: 18, width: 6, height: 6 },
    ],
    connections: [
      { from: "entrance", to: "main_hall" },
      { from: "main_hall", to: "north_chamber" },
      { from: "main_hall", to: "south_chamber" },
      { from: "main_hall", to: "treasure_vault" },
      { from: "north_chamber", to: "guard_room" },
      { from: "north_chamber", to: "armory" },
      { from: "south_chamber", to: "healing_chamber" },
      { from: "treasure_vault", to: "exit_chamber" },
    ],
    vaultConnections: [
      { from: "north_chamber", to: "locked_vault1" },
      { from: "guard_room", to: "locked_vault2" },
    ],
  },
  // Level 5+: Complex maze-like dungeon (scaled up)
  {
    chambers: [
      { name: "entrance", x: 1, y: 16, width: 6, height: 6 },
      { name: "central_hub", x: 18, y: 15, width: 8, height: 8 },
      { name: "north_wing", x: 15, y: 4, width: 12, height: 8 },
      { name: "south_wing", x: 15, y: 26, width: 12, height: 6 },
      { name: "east_wing", x: 30, y: 12, width: 8, height: 12 },
      { name: "west_wing", x: 4, y: 12, width: 8, height: 12 },
      { name: "treasure_chamber", x: 32, y: 4, width: 6, height: 6 },
      { name: "boss_chamber", x: 20, y: 2, width: 6, height: 6 },
      { name: "secret_room", x: 2, y: 4, width: 6, height: 5 },
      { name: "armory", x: 34, y: 26, width: 6, height: 6 },
      { name: "healing_chamber", x: 2, y: 26, width: 6, height: 6 },
      { name: "locked_vault1", x: 40, y: 4, width: 6, height: 6 },
      { name: "locked_vault2", x: 8, y: 2, width: 6, height: 6 },
      { name: "locked_vault3", x: 40, y: 18, width: 6, height: 6 },
      { name: "exit_chamber", x: 40, y: 26, width: 6, height: 6 },
    ],
    connections: [
      { from: "entrance", to: "west_wing" },
      { from: "west_wing", to: "central_hub" },
      { from: "central_hub", to: "north_wing" },
      { from: "central_hub", to: "south_wing" },
      { from: "central_hub", to: "east_wing" },
      { from: "north_wing", to: "treasure_chamber" },
      { from: "north_wing", to: "boss_chamber" },
      { from: "west_wing", to: "secret_room" },
      { from: "west_wing", to: "healing_chamber" },
      { from: "east_wing", to: "armory" },
      { from: "east_wing", to: "exit_chamber" },
    ],
    vaultConnections: [
      { from: "treasure_chamber", to: "locked_vault1" },
      { from: "boss_chamber", to: "locked_vault2" },
      { from: "east_wing", to: "locked_vault3" },
    ],
  },
]

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const walkSoundRef = useRef<HTMLAudioElement | null>(null)
  const [isWalking, setIsWalking] = useState(false)
  const [equipMessage, setEquipMessage] = useState<string | null>(null)
  const [pickupMessage, setPickupMessage] = useState<string | null>(null)
  const [deviceType, setDeviceType] = useState<"mobile" | "desktop" | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 700, height: 225 })

  const [gameState, setGameState] = useState<GameState>({
    player: {
      x: 50,
      y: 50,
      health: 100,
      maxHealth: 100,
      gold: 0,
      weapon: "whip",
      armor: "none",
      inventory: [
        { id: "whip_1", type: "weapon", name: "Whip", damage: 15 },
        { id: "torch_1", type: "misc", name: "Torch" },
      ],
    },
    camera: {
      x: 0,
      y: 0,
    },
    level: 1,
    enemies: [],
    treasures: [],
    walls: [],
    lockedDoors: [],
    exploredTiles: new Set(),
    exit: { x: 0, y: 0 },
    gameStarted: false,
    gameWon: false,
    showInventory: false,
    levelComplete: false,
    combatState: {
      active: false,
      enemy: null,
      playerTurn: true,
    },
  })

  const [joystick, setJoystick] = useState({
    active: false,
    x: 0,
    y: 0,
    centerX: 0,
    centerY: 0,
  })

  const [keys, setKeys] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
    ArrowUp: false,
    ArrowLeft: false,
    ArrowDown: false,
    ArrowRight: false,
  })

  // Add this useEffect at the beginning of the component, after the state declarations
  useEffect(() => {
    // Force landscape orientation on mobile devices
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock("landscape").catch(() => {
        // Fallback if orientation lock fails
        console.log("Orientation lock not supported")
      })
    }

    // Add CSS to encourage landscape mode
    const style = document.createElement("style")
    style.textContent = `
@media screen and (max-width: 768px) and (orientation: portrait) {
  body::before {
    content: "Please rotate your device to landscape mode for the best experience";
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    z-index: 9999;
    text-align: center;
    font-size: 16px;
    max-width: 90%;
    box-sizing: border-box;
  }
}
`
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Dynamic canvas sizing
  useEffect(() => {
    const updateCanvasSize = () => {
      if (deviceType === "desktop") {
        const topOffset = 100 // Space for header
        const bottomOffset = 100 // Space for inventory button
        const newWidth = window.innerWidth - 40 // p-4 padding
        const newHeight = window.innerHeight - topOffset - bottomOffset
        setCanvasSize({ width: newWidth, height: newHeight })
      } else {
        setCanvasSize({ width: 700, height: 225 })
      }
    }

    if (deviceType) {
      updateCanvasSize()
    }

    if (deviceType === "desktop") {
      window.addEventListener("resize", updateCanvasSize)
      return () => window.removeEventListener("resize", updateCanvasSize)
    }
  }, [deviceType])

  // Initialize comprehensive audio system
  useEffect(() => {
    if (!gameState.gameStarted) return

    // Create realistic walking sound using Web Audio API
    const createWalkSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      const playWalkStep = () => {
        // Create multiple oscillators for realistic footstep
        const lowFreq = audioContext.createOscillator()
        const midFreq = audioContext.createOscillator()
        const highFreq = audioContext.createOscillator()

        const lowGain = audioContext.createGain()
        const midGain = audioContext.createGain()
        const highGain = audioContext.createGain()
        const masterGain = audioContext.createGain()

        // Low frequency for boot impact
        lowFreq.type = "square"
        lowFreq.frequency.setValueAtTime(80, audioContext.currentTime)
        lowFreq.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.1)

        // Mid frequency for leather/fabric sound
        midFreq.type = "sawtooth"
        midFreq.frequency.setValueAtTime(200, audioContext.currentTime)
        midFreq.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.08)

        // High frequency for dirt/gravel crunch
        highFreq.type = "triangle"
        highFreq.frequency.setValueAtTime(800, audioContext.currentTime)
        highFreq.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.05)

        // Volume envelopes
        lowGain.gain.setValueAtTime(0.3, audioContext.currentTime)
        lowGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)

        midGain.gain.setValueAtTime(0.2, audioContext.currentTime)
        midGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.12)

        highGain.gain.setValueAtTime(0.4, audioContext.currentTime)
        highGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08)

        masterGain.gain.setValueAtTime(0.6, audioContext.currentTime)

        // Connect audio graph
        lowFreq.connect(lowGain)
        midFreq.connect(midGain)
        highFreq.connect(highGain)

        lowGain.connect(masterGain)
        midGain.connect(masterGain)
        highGain.connect(masterGain)
        masterGain.connect(audioContext.destination)

        // Play sounds
        lowFreq.start()
        midFreq.start()
        highFreq.start()

        lowFreq.stop(audioContext.currentTime + 0.15)
        midFreq.stop(audioContext.currentTime + 0.12)
        highFreq.stop(audioContext.currentTime + 0.08)
      }

      return playWalkStep
    }

    // Create combat attack sound
    const createAttackSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      return () => {
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()
        const filter = audioContext.createBiquadFilter()

        osc.type = "sawtooth"
        osc.frequency.setValueAtTime(150, audioContext.currentTime)
        osc.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.1)

        filter.type = "lowpass"
        filter.frequency.setValueAtTime(800, audioContext.currentTime)

        gain.gain.setValueAtTime(0.8, audioContext.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)

        osc.connect(filter)
        filter.connect(gain)
        gain.connect(audioContext.destination)

        osc.start()
        osc.stop(audioContext.currentTime + 0.15)
      }
    }

    // Create enemy hit sound
    const createEnemyHitSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      return () => {
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()

        osc.type = "square"
        osc.frequency.setValueAtTime(200, audioContext.currentTime)
        osc.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.08)

        gain.gain.setValueAtTime(0.6, audioContext.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

        osc.connect(gain)
        gain.connect(audioContext.destination)

        osc.start()
        osc.stop(audioContext.currentTime + 0.1)
      }
    }

    // Create enemy death sound
    const createEnemyDeathSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      return () => {
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()
        const filter = audioContext.createBiquadFilter()

        osc.type = "sawtooth"
        osc.frequency.setValueAtTime(300, audioContext.currentTime)
        osc.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.4)

        filter.type = "lowpass"
        filter.frequency.setValueAtTime(1000, audioContext.currentTime)
        filter.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.4)

        gain.gain.setValueAtTime(0.7, audioContext.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)

        osc.connect(filter)
        filter.connect(gain)
        gain.connect(audioContext.destination)

        osc.start()
        osc.stop(audioContext.currentTime + 0.4)
      }
    }

    // Create treasure pickup sound
    const createTreasureSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      return (type: string) => {
        const osc1 = audioContext.createOscillator()
        const osc2 = audioContext.createOscillator()
        const gain = audioContext.createGain()

        // Different frequencies for different treasure types
        let freq1 = 800,
          freq2 = 1200
        switch (type) {
          case "gold":
            freq1 = 800
            freq2 = 1200
            break
          case "gem":
            freq1 = 1000
            freq2 = 1500
            break
          case "weapon":
          case "armor":
            freq1 = 600
            freq2 = 900
            break
          case "health_potion":
            freq1 = 400
            freq2 = 600
            break
          case "key":
            freq1 = 1200
            freq2 = 1800
            break
        }

        osc1.type = "sine"
        osc1.frequency.setValueAtTime(freq1, audioContext.currentTime)
        osc1.frequency.exponentialRampToValueAtTime(freq1 * 1.5, audioContext.currentTime + 0.1)

        osc2.type = "sine"
        osc2.frequency.setValueAtTime(freq2, audioContext.currentTime)
        osc2.frequency.exponentialRampToValueAtTime(freq2 * 1.5, audioContext.currentTime + 0.1)

        gain.gain.setValueAtTime(0.4, audioContext.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

        osc1.connect(gain)
        osc2.connect(gain)
        gain.connect(audioContext.destination)

        osc1.start()
        osc2.start()
        osc1.stop(audioContext.currentTime + 0.2)
        osc2.stop(audioContext.currentTime + 0.2)
      }
    }

    // Create door unlock sound
    const createDoorUnlockSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      return () => {
        // Key turning sound
        const keyOsc = audioContext.createOscillator()
        const keyGain = audioContext.createGain()

        keyOsc.type = "square"
        keyOsc.frequency.setValueAtTime(400, audioContext.currentTime)
        keyOsc.frequency.linearRampToValueAtTime(350, audioContext.currentTime + 0.1)

        keyGain.gain.setValueAtTime(0.3, audioContext.currentTime)
        keyGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)

        keyOsc.connect(keyGain)
        keyGain.connect(audioContext.destination)

        keyOsc.start()
        keyOsc.stop(audioContext.currentTime + 0.15)

        // Door opening sound (delayed)
        setTimeout(() => {
          const doorOsc = audioContext.createOscillator()
          const doorGain = audioContext.createGain()
          const filter = audioContext.createBiquadFilter()

          doorOsc.type = "sawtooth"
          doorOsc.frequency.setValueAtTime(150, audioContext.currentTime)
          doorOsc.frequency.linearRampToValueAtTime(120, audioContext.currentTime + 0.3)

          filter.type = "lowpass"
          filter.frequency.setValueAtTime(500, audioContext.currentTime)

          doorGain.gain.setValueAtTime(0.5, audioContext.currentTime)
          doorGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

          doorOsc.connect(filter)
          filter.connect(doorGain)
          doorGain.connect(audioContext.destination)

          doorOsc.start()
          doorOsc.stop(audioContext.currentTime + 0.3)
        }, 200)
      }
    }

    // Create inventory sound
    const createInventorySound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      return (opening: boolean) => {
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()

        osc.type = "triangle"
        if (opening) {
          osc.frequency.setValueAtTime(600, audioContext.currentTime)
          osc.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1)
        } else {
          osc.frequency.setValueAtTime(800, audioContext.currentTime)
          osc.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1)
        }

        gain.gain.setValueAtTime(0.3, audioContext.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

        osc.connect(gain)
        gain.connect(audioContext.destination)

        osc.start()
        osc.stop(audioContext.currentTime + 0.1)
      }
    }

    // Create equip item sound
    const createEquipSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      return () => {
        const osc1 = audioContext.createOscillator()
        const osc2 = audioContext.createOscillator()
        const gain = audioContext.createGain()

        osc1.type = "sine"
        osc1.frequency.setValueAtTime(500, audioContext.currentTime)

        osc2.type = "sine"
        osc2.frequency.setValueAtTime(750, audioContext.currentTime)

        gain.gain.setValueAtTime(0.4, audioContext.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)

        osc1.connect(gain)
        osc2.connect(gain)
        gain.connect(audioContext.destination)

        osc1.start()
        osc2.start()
        osc1.stop(audioContext.currentTime + 0.15)
        osc2.stop(audioContext.currentTime + 0.15)
      }
    }

    // Create level complete sound
    const createLevelCompleteSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      return () => {
        // Victory fanfare
        const frequencies = [523, 659, 784, 1047] // C, E, G, C
        frequencies.forEach((freq, index) => {
          setTimeout(() => {
            const osc = audioContext.createOscillator()
            const gain = audioContext.createGain()

            osc.type = "sine"
            osc.frequency.setValueAtTime(freq, audioContext.currentTime)

            gain.gain.setValueAtTime(0.5, audioContext.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

            osc.connect(gain)
            gain.connect(audioContext.destination)

            osc.start()
            osc.stop(audioContext.currentTime + 0.3)
          }, index * 100)
        })
      }
    }

    // Create game over sound
    const createGameOverSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      return () => {
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()
        const filter = audioContext.createBiquadFilter()

        osc.type = "sawtooth"
        osc.frequency.setValueAtTime(200, audioContext.currentTime)
        osc.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 1.0)

        filter.type = "lowpass"
        filter.frequency.setValueAtTime(800, audioContext.currentTime)
        filter.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 1.0)

        gain.gain.setValueAtTime(0.6, audioContext.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.0)

        osc.connect(filter)
        filter.connect(gain)
        gain.connect(audioContext.destination)

        osc.start()
        osc.stop(audioContext.currentTime + 1.0)
      }
    }

    try {
      walkSoundRef.current = {
        walk: createWalkSound(),
        attack: createAttackSound(),
        enemyHit: createEnemyHitSound(),
        enemyDeath: createEnemyDeathSound(),
        treasure: createTreasureSound(),
        doorUnlock: createDoorUnlockSound(),
        inventory: createInventorySound(),
        equip: createEquipSound(),
        levelComplete: createLevelCompleteSound(),
        gameOver: createGameOverSound(),
      } as any
    } catch (error) {
      console.log("Audio not supported")
    }
  }, [gameState.gameStarted])

  // Generate dungeon level with randomized exit
  const generateLevel = useCallback((level: number) => {
    const enemies: { id: number; x: number; y: number; health: number; maxHealth: number; type: string; lastMoveTime: number }[] = []
    const treasures: { id: number; x: number; y: number; type: string; value: number }[] = []
    const walls = []
    const lockedDoors: { id: number; x: number; y: number; keyId: string; isOpen: boolean }[] = []

    // Create a grid to track which tiles are walls (1) or floor (0)
    const gridWidth = Math.floor(WORLD_WIDTH / TILE_SIZE)
    const gridHeight = Math.floor(WORLD_HEIGHT / TILE_SIZE)
    const grid = Array(gridHeight)
      .fill(null)
      .map(() => Array(gridWidth).fill(1))

    const layoutIndex = Math.min(Math.floor((level - 1) / 2), dungeonLayouts.length - 1)
    const layout = dungeonLayouts[layoutIndex]

    // Carve out chambers (but skip locked vaults initially)
    layout.chambers.forEach((chamber) => {
      // Skip locked vaults - they will be carved out when unlocked
      if (chamber.name.includes("locked_vault")) return

      for (let y = chamber.y; y < chamber.y + chamber.height; y++) {
        for (let x = chamber.x; x < chamber.x + chamber.width; x++) {
          if (y >= 0 && y < gridHeight && x >= 0 && x < gridWidth) {
            grid[y][x] = 0 // Floor
          }
        }
      }
    })

    // Create corridors between connected chambers
    layout.connections.forEach((connection) => {
      const fromChamber = layout.chambers.find((c) => c.name === connection.from)
      const toChamber = layout.chambers.find((c) => c.name === connection.to)

      if (fromChamber && toChamber) {
        const fromX = fromChamber.x + Math.floor(fromChamber.width / 2)
        const fromY = fromChamber.y + Math.floor(fromChamber.height / 2)
        const toX = toChamber.x + Math.floor(toChamber.width / 2)
        const toY = toChamber.y + Math.floor(toChamber.height / 2)

        // Create L-shaped corridor
        const startX = Math.min(fromX, toX)
        const endX = Math.max(fromX, toX)
        for (let x = startX; x <= endX; x++) {
          if (fromY >= 0 && fromY < gridHeight && x >= 0 && x < gridWidth) {
            grid[fromY][x] = 0
            if (fromY + 1 < gridHeight) grid[fromY + 1][x] = 0
          }
        }

        const startY = Math.min(fromY, toY)
        const endY = Math.max(fromY, toY)
        for (let y = startY; y <= endY; y++) {
          if (y >= 0 && y < gridHeight && toX >= 0 && toX < gridWidth) {
            grid[y][toX] = 0
            if (toX + 1 < gridWidth) grid[y][toX + 1] = 0
          }
        }
      }
    })

    // Create corridors leading TO locked vaults (but not into them) and place doors
    if (layout.vaultConnections) {
      layout.vaultConnections.forEach((connection, index) => {
        const fromChamber = layout.chambers.find((c) => c.name === connection.from)
        const toChamber = layout.chambers.find((c) => c.name === connection.to)

        if (fromChamber && toChamber) {
          const keyId = `key_${level}_${index}`

          const fromX = fromChamber.x + Math.floor(fromChamber.width / 2)
          const fromY = fromChamber.y + Math.floor(fromChamber.height / 2)
          const toX = toChamber.x + Math.floor(toChamber.width / 2)
          const toY = toChamber.y + Math.floor(toChamber.height / 2)

          // Create corridor that leads TO the vault but stops at the entrance
          let corridorEndX, corridorEndY

          // Determine which side of the vault to approach from
          if (fromX < toX) {
            // Approaching from the left
            corridorEndX = toChamber.x - 1
            corridorEndY = toY
          } else if (fromX > toX) {
            // Approaching from the right
            corridorEndX = toChamber.x + toChamber.width
            corridorEndY = toY
          } else if (fromY < toY) {
            // Approaching from above
            corridorEndX = toX
            corridorEndY = toChamber.y - 1
          } else {
            // Approaching from below
            corridorEndX = toX
            corridorEndY = toChamber.y + toChamber.height
          }

          // Create L-shaped corridor to the vault entrance
          const startX = Math.min(fromX, corridorEndX)
          const endX = Math.max(fromX, corridorEndX)
          for (let x = startX; x <= endX; x++) {
            if (fromY >= 0 && fromY < gridHeight && x >= 0 && x < gridWidth) {
              grid[fromY][x] = 0
              if (fromY + 1 < gridHeight) grid[fromY + 1][x] = 0
            }
          }

          const startY = Math.min(fromY, corridorEndY)
          const endY = Math.max(fromY, corridorEndY)
          for (let y = startY; y <= endY; y++) {
            if (y >= 0 && y < gridHeight && corridorEndX >= 0 && corridorEndX < gridWidth) {
              grid[y][corridorEndX] = 0
              if (corridorEndX + 1 < gridWidth) grid[y][corridorEndX + 1] = 0
            }
          }

          // Place the locked door at the vault entrance
          let doorX, doorY
          if (fromX < toX) {
            // Door on the left side of vault
            doorX = toChamber.x * TILE_SIZE
            doorY = (toChamber.y + Math.floor(toChamber.height / 2)) * TILE_SIZE
          } else if (fromX > toX) {
            // Door on the right side of vault
            doorX = (toChamber.x + toChamber.width - 1) * TILE_SIZE
            doorY = (toChamber.y + Math.floor(toChamber.height / 2)) * TILE_SIZE
          } else if (fromY < toY) {
            // Door on the top side of vault
            doorX = (toChamber.x + Math.floor(toChamber.width / 2)) * TILE_SIZE
            doorY = toChamber.y * TILE_SIZE
          } else {
            // Door on the bottom side of vault
            doorX = (toChamber.x + Math.floor(toChamber.width / 2)) * TILE_SIZE
            doorY = (toChamber.y + toChamber.height - 1) * TILE_SIZE
          }

          lockedDoors.push({
            id: index,
            x: doorX,
            y: doorY,
            keyId: keyId,
            isOpen: false,
          })

          // Place the key in a random accessible chamber (not locked vaults or exit)
          const accessibleChambers = layout.chambers.filter(
            (c) => !c.name.includes("locked_vault") && c.name !== "exit_chamber",
          )
          const keyChamber = accessibleChambers[Math.floor(Math.random() * accessibleChambers.length)]

          const keyX = (keyChamber.x + 1 + Math.random() * (keyChamber.width - 2)) * TILE_SIZE
          const keyY = (keyChamber.y + 1 + Math.random() * (keyChamber.height - 2)) * TILE_SIZE

          treasures.push({
            id: treasures.length,
            x: keyX,
            y: keyY,
            type: "key",
            value: 0,
            keyId: keyId,
          } as any)
        }
      })
    }

    // Convert grid to wall positions
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        if (grid[y][x] === 1) {
          walls.push({ x: x * TILE_SIZE, y: y * TILE_SIZE })
        }
      }
    }

    // Place enemies in chambers
    const enemyTypes = [
      "mean_dog",
      "fuzzy_cat",
      "mouse",
      "big_bug",
      "snake",
      "venomous_bat",
      "rabid_dog",
      "fierce_gorilla",
    ]
    layout.chambers.forEach((chamber) => {
      // Skip locked vaults for enemy placement
      if (chamber.name.includes("locked_vault")) return

      let enemyCount = 0

      switch (chamber.name) {
        case "monster_den":
        case "boss_chamber":
          enemyCount = 2 + Math.floor(level / 2)
          break
        case "guard_room":
        case "central_hub":
          enemyCount = 1 + Math.floor(level / 3)
          break
        case "main_hall":
        case "treasure_vault":
          enemyCount = Math.floor(level / 2)
          break
        default:
          enemyCount = Math.floor(level / 4)
      }

      for (let i = 0; i < Math.min(enemyCount, 4); i++) {
        const enemyX = (chamber.x + 1 + Math.random() * (chamber.width - 2)) * TILE_SIZE
        const enemyY = (chamber.y + 1 + Math.random() * (chamber.height - 2)) * TILE_SIZE

        const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)]
        let health = 15 + level * 5 // Increased base scaling

        switch (enemyType) {
          case "mean_dog":
            health = 25 + level * 6
            break
          case "big_bug":
            health = 20 + level * 5
            break
          case "mouse":
            health = 10 + level * 3
            break
          case "fuzzy_cat":
            health = 15 + level * 4
            break
          case "snake":
            health = 18 + level * 5
            break
          case "venomous_bat":
            health = 30 + level * 7 // New powerful enemy
            break
          case "rabid_dog":
            health = 35 + level * 8 // New powerful enemy
            break
          case "fierce_gorilla":
            health = 50 + level * 10 // New very powerful enemy
            break
        }

        // Only spawn powerful enemies in higher levels
        if (enemyType === "venomous_bat" && level < 4) {
          continue // Skip this enemy if level too low
        }
        if (enemyType === "rabid_dog" && level < 6) {
          continue // Skip this enemy if level too low
        }
        if (enemyType === "fierce_gorilla" && level < 8) {
          continue // Skip this enemy if level too low
        }

        enemies.push({
          id: enemies.length,
          x: enemyX,
          y: enemyY,
          health,
          maxHealth: health,
          type: enemyType,
          lastMoveTime: 0,
        })
      }
    })

    // Place treasures, weapons, armor, and health potions in specific chambers
    layout.chambers.forEach((chamber) => {
      let treasureCount = 0
      let treasureType = "gold"

      // Skip locked vaults - treasures will be added when unlocked
      if (chamber.name.includes("locked_vault")) {
        return
      }

      switch (chamber.name) {
        case "treasure_vault":
        case "treasure_chamber":
          treasureCount = 3 + Math.floor(level / 2)
          treasureType = "gem"
          break
        case "armory":
          treasureCount = 2 + Math.floor(level / 3)
          treasureType = Math.random() > 0.5 ? "weapon" : "armor"
          break
        case "healing_chamber":
          treasureCount = 2 + Math.floor(level / 2)
          treasureType = "health_potion"
          break
        case "secret_room":
          treasureCount = 2
          treasureType = Math.random() > 0.6 ? "artifact" : Math.random() > 0.5 ? "weapon" : "armor"
          break
        case "boss_chamber":
          treasureCount = 1
          treasureType = Math.random() > 0.6 ? "artifact" : Math.random() > 0.5 ? "weapon" : "armor"
          break
        case "central_hub":
        case "main_hall":
          treasureCount = 1 + Math.floor(level / 3)
          treasureType = Math.random() > 0.7 ? "health_potion" : Math.random() > 0.5 ? "gem" : "gold"
          break
        default:
          treasureCount = Math.floor(level / 4)
          if (Math.random() > 0.8) treasureType = "health_potion"
      }

      for (let i = 0; i < treasureCount; i++) {
        const treasureX = (chamber.x + 1 + Math.random() * (chamber.width - 2)) * TILE_SIZE
        const treasureY = (chamber.y + 1 + Math.random() * (chamber.height - 2)) * TILE_SIZE

        let value = 15 + level * 8

        // Special handling for weapons, armor, and health potions
        if (treasureType === "weapon") {
          const weaponTypes = ["sword", "axe", "mace", "enchanted_sword"]
          const weaponType = weaponTypes[Math.floor(Math.random() * weaponTypes.length)]
          value = 0 // Weapons don't have gold value
          treasures.push({
            id: treasures.length,
            x: treasureX,
            y: treasureY,
            type: weaponType,
            value,
          })
        } else if (treasureType === "armor") {
          const armorTypes = ["leather", "chainmail", "plate", "enchanted_plate"]
          const armorType = armorTypes[Math.floor(Math.random() * armorTypes.length)]
          value = 0 // Armor doesn't have gold value
          treasures.push({
            id: treasures.length,
            x: treasureX,
            y: treasureY,
            type: armorType,
            value,
          })
        } else if (treasureType === "health_potion") {
          value = 30 + level * 5 // Health restoration amount
          treasures.push({
            id: treasures.length,
            x: treasureX,
            y: treasureY,
            type: "health_potion",
            value,
          })
        } else {
          treasures.push({
            id: treasures.length,
            x: treasureX,
            y: treasureY,
            type: treasureType,
            value,
          })
        }
      }
    })

    // Set player start position (entrance chamber)
    const entranceChamber = layout.chambers.find((c) => c.name === "entrance")
    const playerStartX = entranceChamber ? (entranceChamber.x + 1) * TILE_SIZE : 50
    const playerStartY = entranceChamber ? (entranceChamber.y + 1) * TILE_SIZE : 50

    // Randomize exit position - pick a random chamber that's not the entrance or locked vault
    const possibleExitChambers = layout.chambers.filter(
      (c) => c.name !== "entrance" && !c.name.includes("locked_vault"),
    )
    const randomExitChamber = possibleExitChambers[Math.floor(Math.random() * possibleExitChambers.length)]

    // Place exit in a guaranteed floor position within the chamber (not center, but offset from edges)
    const exitX = randomExitChamber
      ? (randomExitChamber.x + 1 + Math.floor((randomExitChamber.width - 2) / 2)) * TILE_SIZE
      : WORLD_WIDTH - 100
    const exitY = randomExitChamber
      ? (randomExitChamber.y + 1 + Math.floor((randomExitChamber.height - 2) / 2)) * TILE_SIZE
      : WORLD_HEIGHT - 100

    return {
      enemies,
      treasures,
      walls,
      lockedDoors,
      playerStart: { x: playerStartX, y: playerStartY },
      exit: { x: exitX, y: exitY },
    }
  }, [])

  // Update camera to follow player - always center player
  const updateCamera = useCallback(
    (playerX: number, playerY: number) => {
      setGameState((prev) => ({
        ...prev,
        camera: {
          x: Math.max(0, Math.min(WORLD_WIDTH - canvasSize.width, playerX - canvasSize.width / 2)),
          y: Math.max(0, Math.min(WORLD_HEIGHT - canvasSize.height, playerY - canvasSize.height / 2)),
        },
      }))
    },
    [canvasSize.width, canvasSize.height],
  )

  // Check if tile is visible (within vision radius)
  const isTileVisible = useCallback((tileX: number, tileY: number, playerX: number, playerY: number) => {
    const playerTileX = Math.floor(playerX / TILE_SIZE)
    const playerTileY = Math.floor(playerY / TILE_SIZE)
    const distance = Math.sqrt(Math.pow(tileX - playerTileX, 2) + Math.pow(tileY - playerTileY, 2))
    return distance <= VISION_RADIUS
  }, [])

  // Update explored tiles
  const updateExploredTiles = useCallback(
    (playerX: number, playerY: number) => {
      const playerTileX = Math.floor(playerX / TILE_SIZE)
      const playerTileY = Math.floor(playerY / TILE_SIZE)

      for (let y = playerTileY - VISION_RADIUS; y <= playerTileY + VISION_RADIUS; y++) {
        for (let x = playerTileX - VISION_RADIUS; x <= playerTileX + VISION_RADIUS; x++) {
          if (isTileVisible(x, y, playerX, playerY)) {
            setGameState((prev) => ({
              ...prev,
              exploredTiles: new Set([...prev.exploredTiles, `${x},${y}`]),
            }))
          }
        }
      }
    },
    [isTileVisible],
  )

  // Add keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["w", "a", "s", "d", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"].includes(e.key)) {
        e.preventDefault()
        setKeys((prev) => ({ ...prev, [e.key]: true }))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (["w", "a", "s", "d", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"].includes(e.key)) {
        e.preventDefault()
        setKeys((prev) => ({ ...prev, [e.key]: false }))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  // Use item from inventory
  const useItem = useCallback((itemId: string) => {
    setGameState((prev) => {
      const item = prev.player.inventory.find((i) => i.id === itemId)
      if (!item) return prev

      if (item.type === "health_potion") {
        const newHealth = Math.min(prev.player.health + (item.value || 30), prev.player.maxHealth)
        return {
          ...prev,
          player: {
            ...prev.player,
            health: newHealth,
            inventory: prev.player.inventory.filter((i) => i.id !== itemId),
          },
        }
      }

      return prev
    })
  }, [])

  // Equip item from inventory
  const equipItem = useCallback((itemId: string) => {
    setGameState((prev) => {
      const item = prev.player.inventory.find((i) => i.id === itemId)
      if (!item) return prev

      if (item.type === "weapon") {
        // Map weapon names to their keys in the WEAPONS object
        let weaponKey = ""
        switch (item.name) {
          case "Whip":
            weaponKey = "whip"
            break
          case "Iron Sword":
            weaponKey = "sword"
            break
          case "Battle Axe":
            weaponKey = "axe"
            break
          case "War Mace":
            weaponKey = "mace"
            break
          case "Enchanted Blade":
            weaponKey = "enchanted_sword"
            break
          default:
            weaponKey = "whip"
        }

        // Show equipped message
        setEquipMessage(`${item.name} equipped!`)
        setTimeout(() => setEquipMessage(null), 2000)

        // Play equip sound
        if (walkSoundRef.current && (walkSoundRef.current as any).equip) {
          ;(walkSoundRef.current as any).equip()
        }

        return {
          ...prev,
          player: {
            ...prev.player,
            weapon: weaponKey,
          },
        }
      } else if (item.type === "armor") {
        // Map armor names to their keys in the ARMOR object
        let armorKey = ""
        switch (item.name) {
          case "No Armor":
            armorKey = "none"
            break
          case "Leather Armor":
            armorKey = "leather"
            break
          case "Chainmail":
            armorKey = "chainmail"
            break
          case "Plate Armor":
            armorKey = "plate"
            break
          case "Enchanted Plate":
            armorKey = "enchanted_plate"
            break
          default:
            armorKey = "none"
        }

        // Show equipped message
        setEquipMessage(`${item.name} equipped!`)
        setTimeout(() => setEquipMessage(null), 2000)

        // Play equip sound
        if (walkSoundRef.current && (walkSoundRef.current as any).equip) {
          ;(walkSoundRef.current as any).equip()
        }

        return {
          ...prev,
          player: {
            ...prev.player,
            armor: armorKey,
          },
        }
      }

      return prev
    })
  }, [])

  // Start game
  const startGame = () => {
    const levelData = generateLevel(1)
    setGameState((prev) => ({
      ...prev,
      gameStarted: true,
      level: 1,
      levelComplete: false,
      exploredTiles: new Set(), // Reset fog of war
      combatState: { active: false, enemy: null, playerTurn: true },
      player: {
        ...prev.player,
        x: levelData.playerStart.x,
        y: levelData.playerStart.y,
        health: 100,
        gold: 0,
      },
      enemies: levelData.enemies,
      treasures: levelData.treasures,
      walls: levelData.walls,
      lockedDoors: levelData.lockedDoors,
      exit: levelData.exit,
      camera: { x: 0, y: 0 },
    }))

    // Force immediate exploration update after state is set
    setTimeout(() => {
      setGameState((prev) => {
        const newExploredTiles = new Set<string>()
        const playerTileX = Math.floor(levelData.playerStart.x / TILE_SIZE)
        const playerTileY = Math.floor(levelData.playerStart.y / TILE_SIZE)

        // Add tiles around player starting position
        for (let y = playerTileY - VISION_RADIUS; y <= playerTileY + VISION_RADIUS; y++) {
          for (let x = playerTileX - VISION_RADIUS; x <= playerTileX + VISION_RADIUS; x++) {
            const distance = Math.sqrt(Math.pow(x - playerTileX, 2) + Math.pow(y - playerTileY, 2))
            if (distance <= VISION_RADIUS) {
              newExploredTiles.add(`${x},${y}`)
            }
          }
        }

        return {
          ...prev,
          exploredTiles: newExploredTiles,
        }
      })
    }, 50)
  }

  const handleStartGame = (type: "mobile" | "desktop") => {
    setDeviceType(type)
    startGame()
  }

  // Next level
  const nextLevel = () => {
    if (gameState.level >= 10) {
      setGameState((prev) => ({ ...prev, gameWon: true }))
      return
    }

    const levelData = generateLevel(gameState.level + 1)

    // First, completely clear the state
    setGameState((prev) => ({
      ...prev,
      level: prev.level + 1,
      levelComplete: false,
      exploredTiles: new Set(), // Completely reset fog of war
      combatState: { active: false, enemy: null, playerTurn: true },
      player: {
        ...prev.player,
        x: levelData.playerStart.x,
        y: levelData.playerStart.y,
        // Don't restore health on level up
      },
      enemies: levelData.enemies,
      treasures: levelData.treasures,
      walls: levelData.walls,
      lockedDoors: levelData.lockedDoors,
      exit: levelData.exit,
      camera: { x: 0, y: 0 },
    }))

    // Force immediate exploration update after state is set
    setTimeout(() => {
      setGameState((prev) => {
        const newExploredTiles = new Set<string>()
        const playerTileX = Math.floor(levelData.playerStart.x / TILE_SIZE)
        const playerTileY = Math.floor(levelData.playerStart.y / TILE_SIZE)

        // Add tiles around player starting position
        for (let y = playerTileY - VISION_RADIUS; y <= playerTileY + VISION_RADIUS; y++) {
          for (let x = playerTileX - VISION_RADIUS; x <= playerTileX + VISION_RADIUS; x++) {
            const distance = Math.sqrt(Math.pow(x - playerTileX, 2) + Math.pow(y - playerTileY, 2))
            if (distance <= VISION_RADIUS) {
              newExploredTiles.add(`${x},${y}`)
            }
          }
        }

        return {
          ...prev,
          exploredTiles: newExploredTiles,
        }
      })
    }, 50)
  }

  const startCombat = useCallback((enemy: any) => {
    setGameState((prev) => ({
      ...prev,
      combatState: {
        active: true,
        enemy: enemy,
        playerTurn: true,
      },
    }))
  }, [])

  const fightEnemy = () => {
    // Play attack sound
    if (walkSoundRef.current && (walkSoundRef.current as any).attack) {
      ;(walkSoundRef.current as any).attack()
    }

    setGameState((prev) => {
      if (!prev.combatState.enemy) return prev

      // Calculate damage based on weapon
      const weaponDamage = WEAPONS[prev.player.weapon as keyof typeof WEAPONS]?.damage || 15
      const damage = Math.floor(weaponDamage + Math.random() * 10) // Whole numbers only
      const newEnemyHealth = prev.combatState.enemy.health - damage

      if (newEnemyHealth <= 0) {
        // Play enemy death sound
        setTimeout(() => {
          if (walkSoundRef.current && (walkSoundRef.current as any).enemyDeath) {
            ;(walkSoundRef.current as any).enemyDeath()
          }
        }, 100)

        // Enemy defeated
        return {
          ...prev,
          enemies: prev.enemies.filter((e) => e.id !== prev.combatState.enemy.id),
          player: { ...prev.player, gold: prev.player.gold + 10 },
          combatState: { active: false, enemy: null, playerTurn: true },
        }
      } else {
        // Play enemy hit sound
        setTimeout(() => {
          if (walkSoundRef.current && (walkSoundRef.current as any).enemyHit) {
            ;(walkSoundRef.current as any).enemyHit()
          }
        }, 50)

        // Enemy attacks back - armor reduces damage
        const armorDefense = ARMOR[prev.player.armor as keyof typeof ARMOR]?.defense || 0
        let baseDamage = Math.floor(8 + Math.random() * 6)

        // Scale enemy damage based on type and level
        switch (prev.combatState.enemy.type) {
          case "mean_dog":
            baseDamage = Math.floor(10 + prev.level * 2 + Math.random() * 8)
            break
          case "big_bug":
            baseDamage = Math.floor(12 + prev.level * 2 + Math.random() * 6)
            break
          case "snake":
            baseDamage = Math.floor(14 + prev.level * 2 + Math.random() * 6)
            break
          case "venomous_bat":
            baseDamage = Math.floor(16 + prev.level * 3 + Math.random() * 10)
            break
          case "rabid_dog":
            baseDamage = Math.floor(18 + prev.level * 3 + Math.random() * 12)
            break
          case "fierce_gorilla":
            baseDamage = Math.floor(25 + prev.level * 4 + Math.random() * 15)
            break
          default:
            baseDamage = Math.floor(8 + prev.level * 1 + Math.random() * 6)
        }

        const finalDamage = Math.max(1, baseDamage - armorDefense) // Minimum 1 damage
        const newPlayerHealth = prev.player.health - finalDamage

        if (newPlayerHealth <= 0) {
          // Play game over sound
          setTimeout(() => {
            if (walkSoundRef.current && (walkSoundRef.current as any).gameOver) {
              ;(walkSoundRef.current as any).gameOver()
            }
          }, 200)

          // Game over
          return {
            ...prev,
            player: { ...prev.player, health: 0 },
            combatState: { active: false, enemy: null, playerTurn: true },
          }
        }

        // Update enemy health and continue combat
        const updatedEnemies = prev.enemies.map((e) =>
          e.id === prev.combatState.enemy.id ? { ...e, health: newEnemyHealth } : e,
        )

        return {
          ...prev,
          enemies: updatedEnemies,
          player: { ...prev.player, health: newPlayerHealth },
          combatState: {
            ...prev.combatState,
            enemy: { ...prev.combatState.enemy, health: newEnemyHealth },
          },
        }
      }
    })
  }

  const fleeFromEnemy = () => {
    // Move player away from enemy
    setGameState((prev) => {
      if (!prev.combatState.enemy) return prev

      const enemy = prev.combatState.enemy
      const dx = prev.player.x - enemy.x
      const dy = prev.player.y - enemy.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance > 0) {
        const moveDistance = TILE_SIZE * 2
        const newX = Math.max(0, Math.min(WORLD_WIDTH - TILE_SIZE, prev.player.x + (dx / distance) * moveDistance))
        const newY = Math.max(0, Math.min(WORLD_HEIGHT - TILE_SIZE, prev.player.y + (dy / distance) * moveDistance))

        return {
          ...prev,
          player: { ...prev.player, x: newX, y: newY },
          combatState: { active: false, enemy: null, playerTurn: true },
        }
      }

      return {
        ...prev,
        combatState: { active: false, enemy: null, playerTurn: true },
      }
    })
  }

  // Move these outside of handleCanvasClick function
  const handleUseItem = useCallback(
    (itemId: string) => {
      useItem(itemId)
    },
    [useItem],
  )

  const handleEquipItem = useCallback(
    (itemId: string) => {
      equipItem(itemId)
    },
    [equipItem],
  )

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    // Remove inventory button click detection - inventory will be handled outside canvas
  }

  // Handle joystick
  const handleJoystickStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

    setJoystick((prev) => ({
      ...prev,
      active: true,
      centerX: clientX - rect.left,
      centerY: clientY - rect.top,
    }))
  }

  const handleJoystickMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!joystick.active) return
    e.preventDefault()

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

    const deltaX = clientX - rect.left - joystick.centerX
    const deltaY = clientY - rect.top - joystick.centerY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const maxDistance = 30

    if (distance > maxDistance) {
      const angle = Math.atan2(deltaY, deltaX)
      setJoystick((prev) => ({
        ...prev,
        x: Math.cos(angle) * maxDistance,
        y: Math.sin(angle) * maxDistance,
      }))
    } else {
      setJoystick((prev) => ({
        ...prev,
        x: deltaX,
        y: deltaY,
      }))
    }
  }

  const handleJoystickEnd = () => {
    setJoystick((prev) => ({
      ...prev,
      active: false,
      x: 0,
      y: 0,
    }))
  }

  // Game loop
  useEffect(() => {
    if (!gameState.gameStarted || gameState.combatState.active) return

    const gameLoop = setInterval(() => {
      setGameState((prev) => {
        const newState = { ...prev }

        // Calculate movement from both keyboard and joystick
        let moveX = 0
        let moveY = 0

        // Keyboard movement
        if (keys.w || keys.ArrowUp) moveY -= 1
        if (keys.s || keys.ArrowDown) moveY += 1
        if (keys.a || keys.ArrowLeft) moveX -= 1
        if (keys.d || keys.ArrowRight) moveX += 1

        // Joystick movement
        if (joystick.x !== 0 || joystick.y !== 0) {
          moveX += joystick.x / 30
          moveY += joystick.y / 30
        }

        // Apply movement if there's any input
        if (moveX !== 0 || moveY !== 0) {
          const speed = 5
          let newX = prev.player.x + moveX * speed
          let newY = prev.player.y + moveY * speed

          // Clamp to world bounds
          newX = Math.max(0, Math.min(WORLD_WIDTH - TILE_SIZE, newX))
          newY = Math.max(0, Math.min(WORLD_HEIGHT - TILE_SIZE, newY))

          // Check wall collisions separately for X and Y movement
          const collisionX = prev.walls.some(
            (wall) =>
              newX < wall.x + TILE_SIZE &&
              newX + TILE_SIZE > wall.x &&
              prev.player.y < wall.y + TILE_SIZE &&
              prev.player.y + TILE_SIZE > wall.y,
          )

          const collisionY = prev.walls.some(
            (wall) =>
              prev.player.x < wall.x + TILE_SIZE &&
              prev.player.x + TILE_SIZE > wall.x &&
              newY < wall.y + TILE_SIZE &&
              newY + TILE_SIZE > wall.y,
          )

          // Check locked door collisions
          const doorCollisionX = prev.lockedDoors.some(
            (door) =>
              !door.isOpen &&
              newX < door.x + TILE_SIZE &&
              newX + TILE_SIZE > door.x &&
              prev.player.y < door.y + TILE_SIZE &&
              prev.player.y + TILE_SIZE > door.y,
          )

          const doorCollisionY = prev.lockedDoors.some(
            (door) =>
              !door.isOpen &&
              prev.player.x < door.x + TILE_SIZE &&
              prev.player.x + TILE_SIZE > door.x &&
              newY < door.y + TILE_SIZE &&
              newY + TILE_SIZE > door.y,
          )

          // Apply movement only if no collision
          if (!collisionX && !doorCollisionX) {
            newState.player.x = newX
          }
          if (!collisionY && !doorCollisionY) {
            newState.player.y = newY
          }

          // Play walking sound if any movement occurred
          if ((!collisionX && !doorCollisionX && moveX !== 0) || (!collisionY && !doorCollisionY && moveY !== 0)) {
            if (!isWalking) {
              setIsWalking(true)
              if (walkSoundRef.current && (walkSoundRef.current as any).walk) {
                ;(walkSoundRef.current as any).walk()
              }
              setTimeout(() => setIsWalking(false), 400)
            }
          }
        }

        // Move enemies toward player (much faster and more aggressive)
        const currentTime = Date.now()
        newState.enemies = prev.enemies.map((enemy) => {
          if (currentTime - enemy.lastMoveTime < 150) return enemy // Move every 0.15 seconds

          const dx = newState.player.x - enemy.x
          const dy = newState.player.y - enemy.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance > TILE_SIZE * 12) return { ...enemy, lastMoveTime: currentTime } // Increased chase range

          const speed = 7 // Increased from 4 to 7
          let newX = enemy.x
          let newY = enemy.y

          if (distance > 0) {
            newX += (dx / distance) * speed
            newY += (dy / distance) * speed
          }

          // Check wall collisions for enemies
          const collision = prev.walls.some(
            (wall) =>
              newX < wall.x + TILE_SIZE &&
              newX + TILE_SIZE > wall.x &&
              newY < wall.y + TILE_SIZE &&
              newY + TILE_SIZE > wall.y,
          )

          // Check locked door collisions for enemies
          const doorCollision = prev.lockedDoors.some(
            (door) =>
              !door.isOpen &&
              newX < door.x + TILE_SIZE &&
              newX + TILE_SIZE > door.x &&
              newY < door.y + TILE_SIZE &&
              newY + TILE_SIZE > door.y,
          )

          if (collision || doorCollision) {
            return { ...enemy, lastMoveTime: currentTime }
          }

          return { ...enemy, x: newX, y: newY, lastMoveTime: currentTime }
        })

        // Check for enemy encounters
        const nearbyEnemy = newState.enemies.find((enemy) => {
          const distance = Math.sqrt(
            Math.pow(enemy.x - newState.player.x, 2) + Math.pow(enemy.y - newState.player.y, 2),
          )
          return distance < TILE_SIZE * 1.2
        })

        if (nearbyEnemy && !prev.combatState.active) {
          setTimeout(() => startCombat(nearbyEnemy), 100)
        }

        // Check treasure collection
        newState.treasures = prev.treasures.filter((treasure) => {
          const distance = Math.sqrt(Math.pow(treasure.x - prev.player.x, 2) + Math.pow(treasure.y - prev.player.y, 2))
          if (distance < TILE_SIZE) {
            // Play treasure sound
            if (walkSoundRef.current && (walkSoundRef.current as any).treasure) {
              ;(walkSoundRef.current as any).treasure(treasure.type)
            }

            // Handle different treasure types
            if (treasure.type === "key") {
              // Add key to inventory
              const keyId = `key_${Date.now()}_${Math.random()}`
              newState.player.inventory.push({
                id: keyId,
                type: "key",
                name: "Vault Key",
                keyId: (treasure as any).keyId,
              })
              setPickupMessage("Vault Key picked up!")
              setTimeout(() => setPickupMessage(null), 2000)
            } else if (treasure.type === "health_potion") {
              // Add potion to inventory instead of using immediately
              const potionId = `potion_${Date.now()}_${Math.random()}`
              newState.player.inventory.push({
                id: potionId,
                type: "health_potion",
                name: "Health Potion",
                value: treasure.value,
              })
              setPickupMessage("Health Potion picked up!")
              setTimeout(() => setPickupMessage(null), 2000)
            } else if (["sword", "axe", "mace", "enchanted_sword"].includes(treasure.type)) {
              // Add weapon to inventory
              const weaponId = `weapon_${Date.now()}_${Math.random()}`
              const weaponName = WEAPONS[treasure.type as keyof typeof WEAPONS]?.name || treasure.type
              newState.player.inventory.push({
                id: weaponId,
                type: "weapon",
                name: weaponName,
                damage: WEAPONS[treasure.type as keyof typeof WEAPONS]?.damage || 15,
              })
              setPickupMessage(`${weaponName} picked up!`)
              setTimeout(() => setPickupMessage(null), 2000)
            } else if (["leather", "chainmail", "plate", "enchanted_plate"].includes(treasure.type)) {
              // Add armor to inventory
              const armorId = `armor_${Date.now()}_${Math.random()}`
              const armorName = ARMOR[treasure.type as keyof typeof ARMOR]?.name || treasure.type
              newState.player.inventory.push({
                id: armorId,
                type: "armor",
                name: armorName,
                defense: ARMOR[treasure.type as keyof typeof ARMOR]?.defense || 0,
              })
              setPickupMessage(`${armorName} picked up!`)
              setTimeout(() => setPickupMessage(null), 2000)
            } else {
              newState.player.gold += treasure.value
              if (treasure.type === "artifact") {
                const artifactId = `artifact_${Date.now()}_${Math.random()}`
                newState.player.inventory.push({
                  id: artifactId,
                  type: "artifact",
                  name: "Ancient Artifact",
                })
                setPickupMessage("Ancient Artifact picked up!")
                setTimeout(() => setPickupMessage(null), 2000)
              } else if (treasure.type === "gem") {
                setPickupMessage(`Gem worth ${treasure.value} gold picked up!`)
                setTimeout(() => setPickupMessage(null), 2000)
              } else {
                setPickupMessage(`${treasure.value} gold picked up!`)
                setTimeout(() => setPickupMessage(null), 2000)
              }
            }
            return false
          }
          return true
        })

        // Check for locked door interactions
        newState.lockedDoors = prev.lockedDoors.map((door) => {
          if (door.isOpen) return door

          const distance = Math.sqrt(Math.pow(door.x - prev.player.x, 2) + Math.pow(door.y - prev.player.y, 2))
          if (distance < TILE_SIZE * 1.5) {
            // Check if player has the key
            const hasKey = prev.player.inventory.some(
              (item) => item.type === "key" && (item as any).keyId === door.keyId,
            )
            if (hasKey) {
              // Remove key from inventory and open door
              newState.player.inventory = newState.player.inventory.filter(
                (item) => !(item.type === "key" && (item as any).keyId === door.keyId),
              )

              // Find and carve out the corresponding vault room
              const layout = dungeonLayouts[Math.min(Math.floor((prev.level - 1) / 2), dungeonLayouts.length - 1)]
              const vaultIndex = prev.lockedDoors.findIndex((d) => d.id === door.id)
              const lockedVaults = layout.chambers.filter((c) => c.name.includes("locked_vault"))

              if (vaultIndex >= 0 && vaultIndex < lockedVaults.length) {
                const vault = lockedVaults[vaultIndex]

                // Remove walls in the vault area
                newState.walls = newState.walls.filter((wall) => {
                  const vaultStartX = vault.x * TILE_SIZE
                  const vaultEndX = (vault.x + vault.width) * TILE_SIZE
                  const vaultStartY = vault.y * TILE_SIZE
                  const vaultEndY = (vault.y + vault.height) * TILE_SIZE

                  return !(wall.x >= vaultStartX && wall.x < vaultEndX && wall.y >= vaultStartY && wall.y < vaultEndY)
                })

                // Add treasures to the newly opened vault
                for (let i = 0; i < 3 + Math.floor(prev.level / 2); i++) {
                  const treasureX = (vault.x + 1 + Math.random() * (vault.width - 2)) * TILE_SIZE
                  const treasureY = (vault.y + 1 + Math.random() * (vault.height - 2)) * TILE_SIZE

                  if (i === 0) {
                    // First item is always a weapon or armor
                    const itemType = Math.random() > 0.5 ? "weapon" : "armor"
                    if (itemType === "weapon") {
                      const weaponTypes = ["sword", "axe", "mace", "enchanted_sword"]
                      const weaponType = weaponTypes[Math.floor(Math.random() * weaponTypes.length)]
                      newState.treasures.push({
                        id: newState.treasures.length,
                        x: treasureX,
                        y: treasureY,
                        type: weaponType,
                        value: 0,
                      })
                    } else {
                      const armorTypes = ["leather", "chainmail", "plate", "enchanted_plate"]
                      const armorType = armorTypes[Math.floor(Math.random() * armorTypes.length)]
                      newState.treasures.push({
                        id: newState.treasures.length,
                        x: treasureX,
                        y: treasureY,
                        type: armorType,
                        value: 0,
                      })
                    }
                  } else {
                    // Other items are high-value gold and gems
                    const value = 50 + prev.level * 15 // Higher value than normal
                    const type = Math.random() > 0.5 ? "gem" : "gold"
                    newState.treasures.push({
                      id: newState.treasures.length,
                      x: treasureX,
                      y: treasureY,
                      type: type,
                      value: value,
                    })
                  }
                }
              }

              // Play door unlock sound
              if (walkSoundRef.current && (walkSoundRef.current as any).doorUnlock) {
                ;(walkSoundRef.current as any).doorUnlock()
              }

              setPickupMessage("Door unlocked! Vault revealed!")
              setTimeout(() => setPickupMessage(null), 2000)
              return { ...door, isOpen: true }
            }
          }
          return door
        })

        // Check if player reached exit
        const exitDistance = Math.sqrt(
          Math.pow(prev.exit.x - newState.player.x, 2) + Math.pow(prev.exit.y - newState.player.y, 2),
        )
        if (exitDistance < TILE_SIZE && !prev.levelComplete) {
          newState.levelComplete = true

          // Play level complete sound
          if (walkSoundRef.current && (walkSoundRef.current as any).levelComplete) {
            ;(walkSoundRef.current as any).levelComplete()
          }

          setTimeout(() => {
            if (newState.level >= 10) {
              setGameState((prev) => ({ ...prev, gameWon: true }))
            } else {
              nextLevel()
            }
          }, 1000)
        }

        return newState
      })

      // Update camera and explored tiles every frame
      updateCamera(gameState.player.x, gameState.player.y)
      updateExploredTiles(gameState.player.x, gameState.player.y)
    }, 50)

    return () => clearInterval(gameLoop)
  }, [
    gameState.gameStarted,
    gameState.combatState.active,
    joystick,
    keys,
    updateExploredTiles,
    updateCamera,
    isWalking,
    startCombat,
  ])

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas with dark dungeon background
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)

    if (!gameState.gameStarted) return

    const playerTileX = Math.floor(gameState.player.x / TILE_SIZE)
    const playerTileY = Math.floor(gameState.player.y / TILE_SIZE)

    // Calculate visible area based on camera
    const startX = Math.floor(gameState.camera.x / TILE_SIZE) * TILE_SIZE
    const endX = startX + canvasSize.width + TILE_SIZE
    const startY = Math.floor(gameState.camera.y / TILE_SIZE) * TILE_SIZE
    const endY = startY + canvasSize.height + TILE_SIZE

    // Draw dungeon floor and walls with fog of war
    for (let x = startX; x < endX; x += TILE_SIZE) {
      for (let y = startY; y < endY; y += TILE_SIZE) {
        const tileX = Math.floor(x / TILE_SIZE)
        const tileY = Math.floor(y / TILE_SIZE)
        const tileKey = `${tileX},${tileY}`

        const isVisible = isTileVisible(tileX, tileY, gameState.player.x, gameState.player.y)
        const isExplored = gameState.exploredTiles.has(tileKey)

        if (!isVisible && !isExplored) continue

        const screenX = x - gameState.camera.x
        const screenY = y - gameState.camera.y

        const isWall = gameState.walls.some((wall) => wall.x === x && wall.y === y)

        if (isWall) {
          // Draw darker rock walls
          ctx.fillStyle = isVisible ? "#1a1a1a" : "#0d0d0d"
          ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE)

          if (isVisible) {
            // Darker rock texture highlights
            ctx.fillStyle = "#2a2a2a"
            ctx.fillRect(screenX + 2, screenY + 2, TILE_SIZE - 8, TILE_SIZE - 8)
            ctx.fillRect(screenX + 6, screenY + 6, TILE_SIZE - 16, TILE_SIZE - 16)

            // Very dark cracks
            ctx.fillStyle = "#000000"
            ctx.fillRect(screenX + 4, screenY + 4, 2, TILE_SIZE - 8)
            ctx.fillRect(screenX + 4, screenY + 4, TILE_SIZE - 8, 2)
          }

          // Darker border
          ctx.strokeStyle = isVisible ? "#333" : "#111"
          ctx.lineWidth = 1
          ctx.strokeRect(screenX, screenY, TILE_SIZE, TILE_SIZE)
        } else {
          // Draw brown dirt floor
          ctx.fillStyle = isVisible ? "#8B4513" : "#5D2F0A"
          ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE)

          if (isVisible) {
            // Add dirt texture pattern
            ctx.fillStyle = "#A0522D"
            ctx.fillRect(screenX + 2, screenY + 2, TILE_SIZE - 4, TILE_SIZE - 4)

            // Add some dirt spots
            ctx.fillStyle = "#654321"
            ctx.fillRect(screenX + 8, screenY + 8, 4, 4)
            ctx.fillRect(screenX + 20, screenY + 16, 3, 3)
            ctx.fillRect(screenX + 12, screenY + 24, 2, 2)
          }
        }
      }
    }

    // Draw locked doors
    gameState.lockedDoors.forEach((door) => {
      const doorTileX = Math.floor(door.x / TILE_SIZE)
      const doorTileY = Math.floor(door.y / TILE_SIZE)
      const doorVisible = isTileVisible(doorTileX, doorTileY, gameState.player.x, gameState.player.y)
      const doorExplored = gameState.exploredTiles.has(`${doorTileX},${doorTileY}`)

      if (doorVisible || doorExplored) {
        const doorScreenX = door.x - gameState.camera.x
        const doorScreenY = door.y - gameState.camera.y

        if (door.isOpen) {
          // Draw open door as floor
          ctx.fillStyle = doorVisible ? "#8B4513" : "#5D2F0A"
          ctx.fillRect(doorScreenX, doorScreenY, TILE_SIZE, TILE_SIZE)
        } else {
          // Draw locked door
          ctx.fillStyle = doorVisible ? "#8B4513" : "#654321"
          ctx.fillRect(doorScreenX, doorScreenY, TILE_SIZE, TILE_SIZE)

          if (doorVisible) {
            // Draw door frame
            ctx.fillStyle = "#654321"
            ctx.fillRect(doorScreenX + 2, doorScreenY + 2, TILE_SIZE - 4, TILE_SIZE - 4)

            // Draw lock symbol
            ctx.fillStyle = "#FFD700"
            ctx.font = "16px Arial"
            ctx.textAlign = "center"
            ctx.fillText("🔒", doorScreenX + TILE_SIZE / 2, doorScreenY + TILE_SIZE / 2 + 5)
          }
        }
      }
    })

    // Draw exit portal (only if visible or explored)
    const exitTileX = Math.floor(gameState.exit.x / TILE_SIZE)
    const exitTileY = Math.floor(gameState.exit.y / TILE_SIZE)
    const exitVisible = isTileVisible(exitTileX, exitTileY, gameState.player.x, gameState.player.y)
    const exitExplored = gameState.exploredTiles.has(`${exitTileX},${exitTileY}`)

    if (exitVisible || exitExplored) {
      const exitScreenX = gameState.exit.x - gameState.camera.x
      const exitScreenY = gameState.exit.y - gameState.camera.y

      ctx.fillStyle = exitVisible ? "#00ff00" : "#006600"
      ctx.fillRect(exitScreenX, exitScreenY, TILE_SIZE, TILE_SIZE)

      if (exitVisible) {
        ctx.fillStyle = "#88ff88"
        ctx.fillRect(exitScreenX + 4, exitScreenY + 4, TILE_SIZE - 8, TILE_SIZE - 8)

        ctx.fillStyle = "#000"
        ctx.font = "20px Arial"
        ctx.textAlign = "center"
        ctx.fillText("🚪", exitScreenX + TILE_SIZE / 2, exitScreenY + TILE_SIZE / 2 + 5)
      }
    }

    // Draw treasures (only if visible)
    gameState.treasures.forEach((treasure) => {
      const treasureTileX = Math.floor(treasure.x / TILE_SIZE)
      const treasureTileY = Math.floor(treasure.y / TILE_SIZE)
      const treasureVisible = isTileVisible(treasureTileX, treasureTileY, gameState.player.x, gameState.player.y)

      if (treasureVisible) {
        const treasureScreenX = treasure.x - gameState.camera.x
        const treasureScreenY = treasure.y - gameState.camera.y

        let color = "#ffd700"
        let symbol = "$"

        // Different colors and symbols for different treasure types
        switch (treasure.type) {
          case "gold":
            color = "#ffd700"
            symbol = "$"
            break
          case "gem":
            color = "#ff69b4"
            symbol = "♦"
            break
          case "artifact":
            color = "#9370db"
            symbol = "★"
            break
          case "health_potion":
            color = "#ff0000"
            symbol = "🧪"
            break
          case "key":
            color = "#ffd700"
            symbol = "🗝️"
            break
          case "sword":
            color = "#c0c0c0"
            symbol = "⚔️"
            break
          case "axe":
            color = "#8b4513"
            symbol = "🪓"
            break
          case "mace":
            color = "#696969"
            symbol = "🔨"
            break
          case "enchanted_sword":
            color = "#9370db"
            symbol = "✨"
            break
          case "leather":
            color = "#8b4513"
            symbol = "🛡️"
            break
          case "chainmail":
            color = "#c0c0c0"
            symbol = "⚔️"
            break
          case "plate":
            color = "#708090"
            symbol = "🛡️"
            break
          case "enchanted_plate":
            color = "#9370db"
            symbol = "✨"
            break
        }

        ctx.fillStyle = color
        ctx.fillRect(treasureScreenX, treasureScreenY, TILE_SIZE, TILE_SIZE)

        ctx.fillStyle = "#000"
        ctx.font = "16px Arial"
        ctx.textAlign = "center"
        ctx.fillText(symbol, treasureScreenX + TILE_SIZE / 2, treasureScreenY + TILE_SIZE / 2 + 5)
      }
    })

    // Draw enemies (only if visible)
    gameState.enemies.forEach((enemy) => {
      const enemyTileX = Math.floor(enemy.x / TILE_SIZE)
      const enemyTileY = Math.floor(enemy.y / TILE_SIZE)
      const enemyVisible = isTileVisible(enemyTileX, enemyTileY, gameState.player.x, gameState.player.y)

      if (enemyVisible) {
        const enemyScreenX = enemy.x - gameState.camera.x
        const enemyScreenY = enemy.y - gameState.camera.y

        let color = "#228b22"
        let symbol = "🐍"

        switch (enemy.type) {
          case "mean_dog":
            color = "#8b4513"
            symbol = "🐕"
            break
          case "fuzzy_cat":
            color = "#dda0dd"
            symbol = "🐱"
            break
          case "mouse":
            color = "#696969"
            symbol = "🐭"
            break
          case "big_bug":
            color = "#8b0000"
            symbol = "🪲"
            break
          case "snake":
            color = "#228b22"
            symbol = "🐍"
            break
          case "venomous_bat":
            color = "#4b0082"
            symbol = "🦇"
            break
          case "rabid_dog":
            color = "#8b0000"
            symbol = "🐺"
            break
          case "fierce_gorilla":
            color = "#2f4f4f"
            symbol = "🦍"
            break
        }

        ctx.fillStyle = color
        ctx.fillRect(enemyScreenX, enemyScreenY, TILE_SIZE, TILE_SIZE)

        ctx.fillStyle = "#fff"
        ctx.font = "16px Arial"
        ctx.textAlign = "center"
        ctx.fillText(symbol, enemyScreenX + TILE_SIZE / 2, enemyScreenY + TILE_SIZE / 2 + 5)

        // Health bar
        const healthPercent = enemy.health / enemy.maxHealth
        ctx.fillStyle = "#ff0000"
        ctx.fillRect(enemyScreenX, enemyScreenY - 8, TILE_SIZE, 4)
        ctx.fillStyle = "#00ff00"
        ctx.fillRect(enemyScreenX, enemyScreenY - 8, TILE_SIZE * healthPercent, 4)
      }
    })

    // Draw player (always visible) - Side-view adventurer sprite with armor
    const playerScreenX = gameState.player.x - gameState.camera.x
    const playerScreenY = gameState.player.y - gameState.camera.y

    // Draw player base (body) - color changes based on armor
    let armorColor = "#8B4513" // Default brown leather
    switch (gameState.player.armor) {
      case "leather":
        armorColor = "#8B4513"
        break
      case "chainmail":
        armorColor = "#C0C0C0"
        break
      case "plate":
        armorColor = "#708090"
        break
      case "enchanted_plate":
        armorColor = "#9370DB"
        break
      default:
        armorColor = "#8B4513"
    }

    ctx.fillStyle = armorColor
    ctx.fillRect(playerScreenX + 8, playerScreenY + 12, 16, 16)

    // Draw player head
    ctx.fillStyle = "#FDBCB4" // Skin tone
    ctx.fillRect(playerScreenX + 10, playerScreenY + 4, 12, 10)

    // Draw hair
    ctx.fillStyle = "#654321" // Brown hair
    ctx.fillRect(playerScreenX + 9, playerScreenY + 3, 14, 6)

    // Draw adventurer hat
    ctx.fillStyle = "#228B22" // Green hat
    ctx.fillRect(playerScreenX + 8, playerScreenY + 2, 16, 4)
    ctx.fillRect(playerScreenX + 6, playerScreenY + 4, 4, 2) // Hat brim

    // Draw eyes
    ctx.fillStyle = "#000000"
    ctx.fillRect(playerScreenX + 12, playerScreenY + 7, 2, 2)
    ctx.fillRect(playerScreenX + 18, playerScreenY + 7, 2, 2)

    // Draw nose
    ctx.fillStyle = "#FDBCB4"
    ctx.fillRect(playerScreenX + 16, playerScreenY + 9, 1, 2)

    // Draw arms
    ctx.fillStyle = armorColor // Match armor color
    ctx.fillRect(playerScreenX + 4, playerScreenY + 14, 6, 10) // Left arm
    ctx.fillRect(playerScreenX + 22, playerScreenY + 14, 6, 10) // Right arm

    // Draw hands
    ctx.fillStyle = "#FDBCB4"
    ctx.fillRect(playerScreenX + 4, playerScreenY + 22, 4, 4) // Left hand
    ctx.fillRect(playerScreenX + 24, playerScreenY + 22, 4, 4) // Right hand

    // Draw weapon in hand based on current weapon
    const currentWeapon = gameState.player.weapon
    ctx.fillStyle = "#C0C0C0" // Silver/metal color

    switch (currentWeapon) {
      case "iron_sword":
      case "enchanted_blade":
        // Draw sword
        ctx.fillStyle = currentWeapon === "enchanted_blade" ? "#9370DB" : "#C0C0C0"
        ctx.fillRect(playerScreenX + 26, playerScreenY + 8, 2, 16) // Blade
        ctx.fillStyle = "#8B4513"
        ctx.fillRect(playerScreenX + 25, playerScreenY + 22, 4, 4) // Hilt
        break
      case "battle_axe":
        // Draw axe
        ctx.fillStyle = "#C0C0C0"
        ctx.fillRect(playerScreenX + 26, playerScreenY + 12, 2, 12) // Handle
        ctx.fillRect(playerScreenX + 24, playerScreenY + 10, 6, 4) // Axe head
        break
      case "war_mace":
        // Draw mace
        ctx.fillStyle = "#696969"
        ctx.fillRect(playerScreenX + 26, playerScreenY + 12, 2, 12) // Handle
        ctx.fillRect(playerScreenX + 24, playerScreenY + 8, 6, 6) // Mace head
        break
      default: // whip
        // Draw whip
        ctx.fillStyle = "#8B4513"
        ctx.fillRect(playerScreenX + 26, playerScreenY + 20, 2, 4) // Handle
        ctx.fillStyle = "#654321"
        ctx.fillRect(playerScreenX + 28, playerScreenY + 22, 4, 1) // Whip cord
        break
    }

    // Draw legs
    ctx.fillStyle = "#4169E1" // Blue pants
    ctx.fillRect(playerScreenX + 10, playerScreenY + 26, 6, 6) // Left leg
    ctx.fillRect(playerScreenX + 16, playerScreenY + 26, 6, 6) // Right leg

    // Draw boots
    ctx.fillStyle = "#8B4513" // Brown boots
    ctx.fillRect(playerScreenX + 8, playerScreenY + 28, 8, 4) // Left boot
    ctx.fillRect(playerScreenX + 16, playerScreenY + 28, 8, 4) // Right boot

    // Draw belt
    ctx.fillStyle = "#654321"
    ctx.fillRect(playerScreenX + 8, playerScreenY + 20, 16, 2)

    // Draw belt buckle
    ctx.fillStyle = "#FFD700" // Gold buckle
    ctx.fillRect(playerScreenX + 14, playerScreenY + 19, 4, 4)

    // Draw backpack
    ctx.fillStyle = "#8B4513"
    ctx.fillRect(playerScreenX + 2, playerScreenY + 12, 4, 8)
    ctx.fillStyle = "#654321"
    ctx.fillRect(playerScreenX + 1, playerScreenY + 14, 2, 4) // Backpack straps

    // Draw HUD overlay - Stats at top (only the stats bar, not the whole canvas)
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.fillRect(0, 0, canvasSize.width, 40)

    ctx.fillStyle = "#FFD700"
    ctx.font = "14px Arial"
    ctx.textAlign = "left"
    ctx.fillText(`Level: ${gameState.level}/10`, 10, 25)
    ctx.fillText(`Health: ${gameState.player.health}/${gameState.player.maxHealth}`, 100, 25)
    ctx.fillText(`Gold: ${gameState.player.gold}`, 240, 25)
    ctx.fillText(`Weapon: ${WEAPONS[gameState.player.weapon as keyof typeof WEAPONS]?.name || "Whip"}`, 320, 25)
    ctx.fillText(`Armor: ${ARMOR[gameState.player.armor as keyof typeof ARMOR]?.name || "No Armor"}`, 520, 25)
  }, [gameState, joystick, isTileVisible, startCombat, canvasSize])

  if (gameState.player.health <= 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-red-900 to-red-700 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-red-800">💀 Game Over 💀</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg">You were defeated in the dungeon!</p>
            <p className="text-red-600">Final Gold: {gameState.player.gold}</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState.gameWon) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-amber-800">🏆 Victory! 🏆</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg">Congratulations! You've escaped all 10 levels of Cohen's Exploration Adventure!</p>
            <p className="text-amber-600">Final Gold: {gameState.player.gold}</p>
            <p className="text-purple-600">
              Final Weapon: {WEAPONS[gameState.player.weapon as keyof typeof WEAPONS]?.name || "Whip"}
            </p>
            <p className="text-blue-600">
              Final Armor: {ARMOR[gameState.player.armor as keyof typeof ARMOR]?.name || "No Armor"}
            </p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Play Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState.gameStarted === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Title Image */}
          <img
            src="/images/title-screen.png"
            alt="Cohen's Exploration Adventure"
            className="max-w-4xl w-full h-auto rounded-lg shadow-2xl"
            style={{ maxHeight: "50vh" }}
          />

          {/* Version Selection */}
          <h2 className="text-xl text-amber-100">Choose your version:</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => handleStartGame("mobile")}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-lg px-10 py-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              📱 Mobile
            </Button>
            <Button
              onClick={() => handleStartGame("desktop")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-10 py-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🖥️ Desktop
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Combat interface
  if (gameState.combatState.active && gameState.combatState.enemy) {
    const enemy = gameState.combatState.enemy
    let enemyName = "Unknown"
    let enemyEmoji = "❓"

    switch (enemy.type) {
      case "mean_dog":
        enemyName = "Mean Dog"
        enemyEmoji = "🐕"
        break
      case "fuzzy_cat":
        enemyName = "Fuzzy Cat"
        enemyEmoji = "🐱"
        break
      case "mouse":
        enemyName = "Mouse"
        enemyEmoji = "🐭"
        break
      case "big_bug":
        enemyName = "Big Bug"
        enemyEmoji = "🪲"
        break
      case "snake":
        enemyName = "Snake"
        enemyEmoji = "🐍"
        break
      case "venomous_bat":
        enemyName = "Venomous Bat"
        enemyEmoji = "🦇"
        break
      case "rabid_dog":
        enemyName = "Rabid Dog"
        enemyEmoji = "🐺"
        break
      case "fierce_gorilla":
        enemyName = "Fierce Gorilla"
        enemyEmoji = "🦍"
        break
    }

    const currentWeapon = WEAPONS[gameState.player.weapon as keyof typeof WEAPONS]
    const currentArmor = ARMOR[gameState.player.armor as keyof typeof ARMOR]

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-red-900 to-red-700 p-4">
        <Card className="w-full max-w-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-lg text-red-800">⚔️ Combat! ⚔️</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2 p-3">
            <div className="text-4xl mb-2">{enemyEmoji}</div>
            <p className="text-sm">You encountered a {enemyName}!</p>
            <div className="space-y-1">
              <p className="text-xs text-red-600">
                Enemy Health: {enemy.health}/{enemy.maxHealth}
              </p>
              <p className="text-xs text-blue-600">
                Your Health: {gameState.player.health}/{gameState.player.maxHealth}
              </p>
              <p className="text-xs text-purple-600">
                Weapon: {currentWeapon?.name || "Whip"} (Damage: {currentWeapon?.damage || 15})
              </p>
              <p className="text-xs text-green-600">
                Armor: {currentArmor?.name || "No Armor"} (Defense: {currentArmor?.defense || 0})
              </p>
            </div>
            <div className="flex gap-1 pt-2">
              <Button onClick={fightEnemy} className="flex-1 bg-red-600 hover:bg-red-700 text-xs py-1">
                ⚔️ Fight
              </Button>
              <Button onClick={fleeFromEnemy} className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-xs py-1">
                🏃 Flee
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Inventory popup overlay
  if (gameState.showInventory) {
    return (
      <div
        className={`flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 p-4 ${
          deviceType === "desktop" ? "justify-start" : "justify-center"
        }`}
      >
        {/* Game Title */}
        <h1 className="text-2xl font-bold text-amber-100 mb-4">Cohen's Exploration Adventure</h1>

        {/* Game Canvas with integrated HUD */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="border-4 border-gray-600 rounded-lg bg-gray-950"
            onMouseDown={handleJoystickStart}
            onMouseMove={handleJoystickMove}
            onMouseUp={handleJoystickEnd}
            onTouchStart={handleJoystickStart}
            onTouchMove={handleJoystickMove}
            onTouchEnd={handleJoystickEnd}
            onClick={handleCanvasClick}
            style={{ touchAction: "none" }}
          />

          {/* Inventory Popup Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <Card className="w-64 max-h-[60vh] overflow-y-auto">
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-lg text-amber-800">📦 Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-3">
                {/* Equipment Message */}
                {equipMessage && (
                  <div className="bg-green-600 text-white text-center text-xs py-2 px-3 rounded mb-2">
                    {equipMessage}
                  </div>
                )}

                <div className="text-center space-y-1">
                  <p className="text-xs text-amber-600">Equipment:</p>
                  <p className="text-xs text-purple-600">
                    Weapon: {WEAPONS[gameState.player.weapon as keyof typeof WEAPONS]?.name || "Whip"}
                  </p>
                  <p className="text-xs text-blue-600">
                    Armor: {ARMOR[gameState.player.armor as keyof typeof ARMOR]?.name || "No Armor"}
                  </p>
                </div>

                <div className="space-y-1">
                  {gameState.player.inventory.length === 0 ? (
                    <p className="text-center text-gray-500 text-xs">Empty</p>
                  ) : (
                    gameState.player.inventory.map((item) => (
                      <div key={item.id} className="p-2 bg-amber-100 rounded text-xs">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <p className="font-bold text-amber-800 text-xs">{item.name}</p>
                            {item.type === "weapon" && item.damage && (
                              <p className="text-xs text-red-600">Dmg: {item.damage}</p>
                            )}
                            {item.type === "armor" && item.defense && (
                              <p className="text-xs text-blue-600">Def: {item.defense}</p>
                            )}
                            {item.type === "health_potion" && item.value && (
                              <p className="text-xs text-green-600">+{item.value} HP</p>
                            )}
                            {item.type === "key" && <p className="text-xs text-yellow-600">Unlocks doors</p>}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {item.type === "health_potion" && (
                            <Button
                              onClick={() => handleUseItem(item.id)}
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1 h-6"
                            >
                              Use
                            </Button>
                          )}
                          {(item.type === "weapon" || item.type === "armor") && (
                            <Button
                              onClick={() => handleEquipItem(item.id)}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1 h-6"
                            >
                              Equip
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <Button
                  onClick={() => {
                    // Play inventory sound
                    if (walkSoundRef.current && (walkSoundRef.current as any).inventory) {
                      ;(walkSoundRef.current as any).inventory(!gameState.showInventory)
                    }
                    setGameState((prev) => ({ ...prev, showInventory: false }))
                  }}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-xs py-1 h-6"
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Inventory Button - Outside the canvas */}
        <Button
          onClick={() => {
            // Play inventory sound
            if (walkSoundRef.current && (walkSoundRef.current as any).inventory) {
              ;(walkSoundRef.current as any).inventory(!gameState.showInventory)
            }
            setGameState((prev) => ({ ...prev, showInventory: !prev.showInventory }))
          }}
          className="mt-4 bg-amber-600 hover:bg-amber-700"
        >
          📦 Inventory
        </Button>
      </div>
    )
  }

  return (
    <div
      className={`flex flex-col items-center min-h-screen p-4 ${
        deviceType === "desktop" ? "justify-start" : "justify-center"
      }`}
    >
      {/* Game Title */}
      {/* <h1 className="text-2xl font-bold text-amber-100 mb-4">Cohen's Exploration Adventure</h1> */}

      {/* Game Canvas with integrated HUD */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="border-4 border-gray-600 rounded-lg"
          onMouseDown={handleJoystickStart}
          onMouseMove={handleJoystickMove}
          onMouseUp={handleJoystickEnd}
          onTouchStart={handleJoystickStart}
          onTouchMove={handleJoystickMove}
          onTouchEnd={handleJoystickEnd}
          onClick={handleCanvasClick}
          style={{ touchAction: "none" }}
        />
        {/* Pickup Message */}
        {pickupMessage && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-white text-center text-sm py-2 px-4 rounded shadow-lg z-10">
            {pickupMessage}
          </div>
        )}
      </div>

      {/* Inventory Button - Outside the canvas */}
      <Button
        onClick={() => {
          // Play inventory sound
          if (walkSoundRef.current && (walkSoundRef.current as any).inventory) {
            ;(walkSoundRef.current as any).inventory(!gameState.showInventory)
          }
          setGameState((prev) => ({ ...prev, showInventory: !prev.showInventory }))
        }}
        className="mt-4 bg-amber-600 hover:bg-amber-700"
      >
        📦 Inventory
      </Button>
    </div>
  )
}
