<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.nimbus.demo.GreetingService" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nimbus DevOps Demo App</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
        }
        .card {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 20px;
            padding: 50px 60px;
            text-align: center;
            max-width: 600px;
            backdrop-filter: blur(10px);
            box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        .logo { font-size: 48px; margin-bottom: 15px; }
        h1 { font-size: 2.2rem; font-weight: 700; color: #e94560; margin-bottom: 10px; }
        .subtitle { font-size: 1rem; color: #a0a8c0; margin-bottom: 30px; }
        .greeting-box {
            background: rgba(233, 69, 96, 0.15);
            border: 1px solid rgba(233, 69, 96, 0.4);
            border-radius: 12px;
            padding: 20px 30px;
            margin: 25px 0;
            font-size: 1.1rem;
            color: #f0f0f0;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 25px;
        }
        .info-item {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
        }
        .info-item .label { font-size: 0.75rem; color: #a0a8c0; text-transform: uppercase; letter-spacing: 1px; }
        .info-item .value { font-size: 1rem; font-weight: 600; color: #53d8fb; margin-top: 5px; }
        .badge {
            display: inline-block;
            background: #e94560;
            color: #fff;
            padding: 6px 18px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            letter-spacing: 1px;
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
<%
    // Using the GreetingService Java class from our source code
    GreetingService greetingService = new GreetingService();
    String greeting = greetingService.getGreeting("DevOps Student");

    // Gather runtime info to display
    String serverInfo = application.getServerInfo();
    String javaVersion = System.getProperty("java.version");
    String buildTime = new java.util.Date().toString();
%>
    <div class="card">
        <div class="logo">🚀</div>
        <span class="badge">LIVE ON TOMCAT</span>
        <h1>Nimbus Demo App</h1>
        <p class="subtitle">Successfully deployed via Jenkins CI/CD Pipeline</p>

        <div class="greeting-box">
            <%= greeting %>
        </div>

        <div class="info-grid">
            <div class="info-item">
                <div class="label">Server</div>
                <div class="value"><%= serverInfo %></div>
            </div>
            <div class="info-item">
                <div class="label">Java Version</div>
                <div class="value"><%= javaVersion %></div>
            </div>
            <div class="info-item">
                <div class="label">App Version</div>
                <div class="value">v1.0</div>
            </div>
            <div class="info-item">
                <div class="label">Deployed At</div>
                <div class="value" style="font-size:0.85rem;"><%= buildTime %></div>
            </div>
        </div>
    </div>
</body>
</html>
