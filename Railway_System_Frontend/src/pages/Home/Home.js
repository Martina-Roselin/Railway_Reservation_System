// src/pages/Home/Home.js
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <div className="hero-badge">
                  <span>🚂</span> Railway Reservation System
                </div>
                <h1 className="hero-title">
                  Journey to Your Dreams
                  <span className="hero-subtitle">Starts Here</span>
                </h1>
                <p className="hero-description">
                  Discover seamless train booking with instant ticket generation, 
                  real-time seat availability, and hassle-free travel planning.
                </p>
                <div className="hero-buttons">
                  <Link to="/search" className="btn btn-primary btn-lg hero-btn-primary">
                    🔍 Search Trains
                  </Link>
                  <Link to="/trains" className="btn btn-outline-light btn-lg hero-btn-secondary">
                    📋 View All Trains
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="section-title">Why Choose RailwayX?</h2>
              <p className="section-subtitle">Experience the future of train booking</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon">
                  <span>🚀</span>
                </div>
                <h3>Instant Booking</h3>
                <p>Book your tickets in seconds with our streamlined booking process</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon">
                  <span>📱</span>
                </div>
                <h3>Mobile Friendly</h3>
                <p>Book from anywhere, anytime with our responsive design</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon">
                  <span>🎫</span>
                </div>
                <h3>Digital Tickets</h3>
                <p>Get instant digital tickets and download PDFs anytime</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon">
                  <span>🔒</span>
                </div>
                <h3>Secure Payment</h3>
                <p>Safe and secure payment processing for your peace of mind</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon">
                  <span>📧</span>
                </div>
                <h3>Email Notifications</h3>
                <p>Receive instant confirmations and updates via email</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon">
                  <span>💺</span>
                </div>
                <h3>Seat Selection</h3>
                <p>Choose your preferred seats with real-time availability</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="quick-actions-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="quick-actions-card">
                <div className="row align-items-center">
                  <div className="col-lg-8">
                    <h3>Ready to Start Your Journey?</h3>
                    <p className="mb-0">Begin your adventure with just a few clicks</p>
                  </div>
                  <div className="col-lg-4 text-lg-end">
                    <Link to="/search" className="btn btn-primary btn-lg">
                      Start Booking Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="row text-center">
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="stat-item">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Trains</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Destinations</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="footer-cta">
        <div className="container text-center">
          <h3>Have Questions?</h3>
          <p>Our support team is here to help you with any queries</p>
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-outline-primary me-3">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
      </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
