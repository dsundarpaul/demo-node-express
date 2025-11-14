#!/bin/bash

echo "🏫 School CMS API Test Script"
echo "=============================="
echo ""

BASE_URL="http://localhost:3000"

echo "📋 1. Testing FS Operations - Student Management"
echo "-------------------------------------------------"

echo "Creating a student..."
curl -X POST $BASE_URL/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Emma Watson",
    "grade": "10th",
    "age": 16,
    "parentContact": "+1-555-0123"
  }'
echo -e "\n"

sleep 1

echo "Creating another student..."
curl -X POST $BASE_URL/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daniel Radcliffe",
    "grade": "11th",
    "age": 17,
    "parentContact": "+1-555-0456"
  }'
echo -e "\n"

sleep 1

echo "Getting all students..."
curl $BASE_URL/api/students
echo -e "\n"

sleep 1

echo ""
echo "📢 2. Testing FS Operations - Announcements"
echo "--------------------------------------------"

echo "Creating an announcement..."
curl -X POST $BASE_URL/api/announcements \
  -H "Content-Type: application/json" \
  -d '{
    "title": "School Holiday Notice",
    "content": "School will be closed on Monday for maintenance",
    "priority": "high"
  }'
echo -e "\n"

sleep 1

echo "Getting all announcements..."
curl $BASE_URL/api/announcements
echo -e "\n"

sleep 1

echo ""
echo "📊 3. Testing FS Operations - Grades"
echo "-------------------------------------"

echo "Adding a grade..."
curl -X POST $BASE_URL/api/grades \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "subject": "Mathematics",
    "grade": "A",
    "semester": "Fall 2024"
  }'
echo -e "\n"

sleep 1

echo "Getting student grades..."
curl $BASE_URL/api/grades/1
echo -e "\n"

sleep 1

echo ""
echo "🌊 4. Testing Data Streaming"
echo "-----------------------------"

echo "Streaming student report..."
curl $BASE_URL/api/stream/report/1
echo -e "\n"

sleep 1

echo "Streaming large file..."
curl $BASE_URL/api/stream/large-file
echo -e "\n"

sleep 1

echo ""
echo "📁 5. Testing File Operations"
echo "------------------------------"

echo "Creating a test image file..."
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > /tmp/test-photo.png

echo "Uploading student photo..."
curl -X POST $BASE_URL/api/upload/student-photo \
  -F "photo=@/tmp/test-photo.png" \
  -F "studentId=1"
echo -e "\n"

sleep 1

echo "Listing all uploads..."
curl $BASE_URL/api/uploads/list
echo -e "\n"

sleep 1

echo ""
echo "📝 6. Testing Activity Logs"
echo "---------------------------"

echo "Viewing activity logs..."
curl $BASE_URL/api/logs/activity
echo -e "\n"

echo ""
echo "✅ All tests completed!"
echo ""
echo "🔔 To test Event Emitting (Server-Sent Events):"
echo "   Open a new terminal and run:"
echo "   curl -N $BASE_URL/api/events/listen"
echo ""
echo "   Then perform any action (create student, upload file, etc.)"
echo "   You'll see events in real-time!"

