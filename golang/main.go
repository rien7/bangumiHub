package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	_ "github.com/go-sql-driver/mysql"
)

type IndexData struct {
	ChannelId int    `json:"channel_id"`
	MessageId int    `json:"message_id"`
	Text      string `json:"text"`
	CreateAt  string `json:"create_at"`
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("failed to load env", err)
	}

	println(os.Getenv("DSN"))
	db, err := sql.Open("mysql", os.Getenv("DSN"))
	if err != nil {
		log.Fatalf("failed to connect: %v", err)
	}
	defer db.Close()
	log.Println("Successfully connected to PlanetScale!")

	route := gin.Default()
	route.POST("/api/v1/insert", func(ctx *gin.Context) {
		insert(db, ctx)
	})

	route.Run()
}

func insert(db *sql.DB, c *gin.Context) {
	var data IndexData
	if err := c.ShouldBindJSON(&data); err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"(insert) c.ShouldBindJSON:": err.Error()})
		return
	}

	log.Println("(insert) data:", data)

	query := "INSERT INTO `index_data` (`channel_id`, `message_id`, `text`, `create_at`) VALUES (?, ?, ?, ?)"
	res, err := db.Exec(query, data.ChannelId, data.MessageId, data.Text, data.CreateAt)

	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"(insert) db.Exec:": err.Error()})
		return
	}

	id, err := res.LastInsertId()
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"(insert) res.LastInsertId:": err.Error()})
		return
	}

	log.Println("Successfully inserted row with id:", id)
	c.JSON(http.StatusOK, gin.H{"id": id})
}
