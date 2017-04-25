pipeline {
  agent any

  tools {
    nodejs '6.10.2'
  }

  environment {
    GH_STATUS_TOKEN = credentials 'github-status-update-token'
    GITHUB_API = 'https://ghe.misosiru.io/api/v3'
    CIRCLE_PROJECT_USERNAME = 'air-design'
    CIRCLE_PROJECT_REPONAME = 'WAIT-promo'
  }

  options {
    ansiColor colorMapName: 'XTerm'
  }

  stages {
    stage('dependency') {
      steps {
        sh 'yarn'
      }
    }

    stage('mock') {
      environment {
        BASEPATH = "${BUILD_URL}html-mock"
      }

      steps {
        sh 'npm run ci:status -- pending jenkins/mock "モックビルド中" ${BUILD_URL}console'
        sh 'npm run dist:fsha'

        publishHTML(target: [
          allowMissing: false,
          alwaysLinkToLastBuild: false,
          keepAll: true,
          reportDir: '.tmp/build',
          reportFiles: 'index.html',
          reportName: 'html-mock'
        ])
      }
      post {
        success {
          sh 'npm run ci:status -- success jenkins/mock "モックビルド成功" ${BUILD_URL}html-mock/wait/index.html'
        }
        failure {
          sh 'npm run ci:status -- failure jenkins/mock "モックビルド失敗" ${BUILD_URL}console'
        }
      }
    }
  }
}
