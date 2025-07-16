<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
        }
        .container {
            width: 80%;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        .header {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #2c3e50;
        }
        .section {
            margin-bottom: 15px;
        }
        .section-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .details {
            margin-left: 20px;
        }
        .issued-date {
            text-align: right;
            font-style: italic;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            Car4Sure Insurance Policy Certificate
        </div>

        <div class="section">
            <div class="section-title">Policy Information</div>
            <div class="details">
                <p><strong>Policy Number:</strong> {{ $policyNo }}</p>
                <p><strong>Policy Status:</strong> {{ $policyStatus }}</p>
                <p><strong>Policy Type:</strong> {{ $policyType }}</p>
                <p><strong>Effective Date:</strong> {{ $effectiveDate }}</p>
                <p><strong>Expiration Date:</strong> {{ $expirationDate }}</p>
            </div>
       