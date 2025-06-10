import { useState } from "react"
import { teamMembers, companyInfo, features, technologies } from '../../data/aboutUsData'

class AboutUsPresenter {
  constructor() {
    this.init()
  }

  init() {
    // Use data from external file
    this.teamMembers = teamMembers
    this.companyInfo = companyInfo
    this.features = features
    this.technologies = technologies
  }
  getTeamMembers() {
    return this.teamMembers
  }

  getFeatures() {
    return this.features
  }

  getStats() {
    return this.stats
  }

  getCompanyInfo() {
    return this.companyInfo
  }

  getTechnologies() {
    return this.technologies
  }

  getRoleColor(type) {
    switch (type) {
      case "ML":
        return "bg-blue-100 text-blue-800"
      case "FE":
        return "bg-green-100 text-green-800"
      case "BE":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
}

export function useAboutUsPresenter() {
  const [presenter] = useState(() => new AboutUsPresenter())

  return {
    teamMembers: presenter.getTeamMembers(),
    features: presenter.getFeatures(),
    stats: presenter.getStats(),
    companyInfo: presenter.getCompanyInfo(),
    technologies: presenter.getTechnologies(),
    getRoleColor: presenter.getRoleColor.bind(presenter),
  }
}

export default AboutUsPresenter
