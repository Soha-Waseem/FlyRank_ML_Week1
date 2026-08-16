/**
 * FlyRank ML Capstone Research Paper Interactivity & Publication Charts
 * Sole Source of Truth: capstone.ipynb
 */

document.addEventListener('DOMContentLoaded', () => {
  initReadingProgress();
  initStickyNavHighlight();
  initCharts();
  initTableFilter();
  initCopyCitation();
});

/* --------------------------------------------------------------------------
   1. Reading Progress Bar & Sticky Header
   -------------------------------------------------------------------------- */
function initReadingProgress() {
  const progressBar = document.getElementById('reading-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  });
}

/* --------------------------------------------------------------------------
   2. Active Section Highlighting in Header Nav
   -------------------------------------------------------------------------- */
function initStickyNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let currentSection = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. Publication Charts (Chart.js Integration)
   -------------------------------------------------------------------------- */
function initCharts() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded');
    return;
  }

  // Common chart styling defaults
  Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
  Chart.defaults.color = '#475569';

  // ------------------------------------------------------------------------
  // Chart 1: Model Comparison Bar Chart (ROC-AUC & Average Precision)
  // ------------------------------------------------------------------------
  const modelCtx = document.getElementById('chart-model-comparison');
  if (modelCtx) {
    new Chart(modelCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Baseline', 'Leakage-safe Logistic Regression', 'Leakage-safe Random Forest'],
        datasets: [
          {
            label: 'ROC-AUC',
            data: [0.5000, 0.5549, 0.5554],
            backgroundColor: '#1e3a8a',
            borderColor: '#1e3a8a',
            borderWidth: 1,
            barPercentage: 0.7,
            categoryPercentage: 0.6
          },
          {
            label: 'Average Precision (AP)',
            data: [0.6005, 0.6289, 0.6386],
            backgroundColor: '#2563eb',
            borderColor: '#2563eb',
            borderWidth: 1,
            barPercentage: 0.7,
            categoryPercentage: 0.6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              boxWidth: 10,
              font: { weight: '600', size: 12 }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.raw.toFixed(4)}`
            }
          }
        },
        scales: {
          y: {
            min: 0.45,
            max: 0.70,
            ticks: { stepSize: 0.05 },
            title: {
              display: true,
              text: 'Metric Score',
              font: { weight: '600' }
            },
            grid: { color: '#e2e8f0' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  // ------------------------------------------------------------------------
  // Chart 2: Monthly Decline-Rate Trend (Train vs Test Shift)
  // ------------------------------------------------------------------------
  const trendCtx = document.getElementById('chart-monthly-trend');
  if (trendCtx) {
    new Chart(trendCtx.getContext('2d'), {
      type: 'line',
      data: {
        labels: [
          'Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25',
          'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25',
          'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26 (Test)', 'May 26 (Test)'
        ],
        datasets: [{
          label: 'Monthly Decline Rate (%)',
          data: [34.6, 34.2, 35.8, 35.9, 37.1, 37.8, 38.4, 39.1, 39.8, 40.5, 41.2, 42.0, 42.6, 43.1, 43.9, 47.9, 48.7],
          borderColor: '#1e3a8a',
          backgroundColor: 'rgba(37, 99, 235, 0.08)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: (context) => context.dataIndex >= 15 ? '#dc2626' : '#1e3a8a'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `Decline Rate: ${context.raw}%`
            }
          }
        },
        scales: {
          y: {
            min: 30,
            max: 55,
            title: { display: true, text: 'Decline Rate (%)', font: { weight: '600' } },
            grid: { color: '#e2e8f0' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  // ------------------------------------------------------------------------
  // Chart 3: Leakage-Safe Feature Importance (Horizontal Bar)
  // ------------------------------------------------------------------------
  const featCtx = document.getElementById('chart-feature-importance');
  if (featCtx) {
    new Chart(featCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: [
          'prev_month_impressions_log',
          'prev_month_clicks_log',
          'ctr_30d',
          'avg_position_30d',
          'scroll_depth_avg',
          'word_count',
          'entity_density',
          'impressions_change_pct_30d',
          'clicks_change_pct_30d',
          'bounce_rate_30d'
        ],
        datasets: [{
          label: 'Relative Importance Score',
          data: [0.1420, 0.1185, 0.1045, 0.0890, 0.0765, 0.0680, 0.0595, 0.0540, 0.0495, 0.0435],
          backgroundColor: '#2563eb',
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `Importance: ${(ctx.raw * 100).toFixed(2)}%`
            }
          }
        },
        scales: {
          x: {
            max: 0.16,
            ticks: {
              callback: (val) => `${(val * 100).toFixed(0)}%`
            },
            title: { display: true, text: 'Importance Weight', font: { weight: '600' } },
            grid: { color: '#e2e8f0' }
          },
          y: {
            grid: { display: false }
          }
        }
      }
    });
  }

  // ------------------------------------------------------------------------
  // Chart 4: Risk-Band Distribution (Doughnut Chart)
  // ------------------------------------------------------------------------
  const riskCtx = document.getElementById('chart-risk-distribution');
  if (riskCtx) {
    new Chart(riskCtx.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Higher Risk (>65% prob)', 'Medium Risk (40-65% prob)', 'Lower Risk (<40% prob)'],
        datasets: [{
          data: [18.5, 34.2, 47.3],
          backgroundColor: ['#dc2626', '#d97706', '#059669'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { usePointStyle: true, boxWidth: 8, font: { weight: '600' } }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.raw}% of recommendations`
            }
          }
        },
        cutout: '65%'
      }
    });
  }
}

/* --------------------------------------------------------------------------
   4. Reason Code Table Filtering
   -------------------------------------------------------------------------- */
function initTableFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const tableRows = document.querySelectorAll('#recommendations-table-body tr');

  if (!filterBtns.length || !tableRows.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      tableRows.forEach(row => {
        const rowReason = row.getAttribute('data-reason');
        if (filterValue === 'all' || rowReason === filterValue) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Citation Helper
   -------------------------------------------------------------------------- */
function initCopyCitation() {
  const copyBtn = document.getElementById('btn-copy-citation');
  const citationText = document.getElementById('citation-text');

  if (!copyBtn || !citationText) return;

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(citationText.innerText.trim()).then(() => {
      const originalText = copyBtn.innerText;
      copyBtn.innerText = 'Copied!';
      copyBtn.style.background = '#ecfdf5';
      copyBtn.style.color = '#047857';
      setTimeout(() => {
        copyBtn.innerText = originalText;
        copyBtn.style.background = '';
        copyBtn.style.color = '';
      }, 2000);
    });
  });
}
