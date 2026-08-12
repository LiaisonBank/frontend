"use client";
import Link from "next/link";
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed

export default function PNGPage() {
  useBodyClass('pest-control-service');
  return (
    <>
      <div className="page-header">
        <div className="inner-header">
          {/* <PageTitleWave /> */}
          <div className="page-title">
            <div className="container">
              <div className="row justify-content-center text-center">
                <div className="col-lg-10">
                  <div className="theme-breadcrumb-box">
                    <h1>Pest Control Service</h1>

                    <nav aria-label="breadcrumb" className="page-breadcrumb">
                      <ol className="breadcrumb justify-content-center">
                        <li className="breadcrumb-item">
                          <Link href="/">
                            <i className="bi bi-house-door me-1" aria-hidden="true"></i>
                            Home
                          </Link>
                        </li>

                        <li
                          className="breadcrumb-item active"
                          aria-current="page"
                        >
                          Pest Control Services and Certification
                        </li>
                      </ol>
                    </nav>

                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <PageTitleWaveLeft /> */}
        </div>
      </div>
      <section className="container py-5">
        <div className="row justify-content-center text-center">
          <div>
            <p>
            Clean, safe, and professionally maintained premises create a stronger impression for customers, employees, and visitors. 
            <b>Pest Control Services Certification</b> is a formal assurance that a property follows approved pest management practices and meets required hygiene and safety standards. It is especially valuable for restaurants, offices, warehouses, hotels, retail outlets, factories, healthcare facilities, and residential communities where cleanliness and compliance are essential.
            </p>
            <p className="pt-4">
            Rather than waiting for infestations to become a costly problem, certified pest control systems focus on prevention, scheduled treatment, monitoring, and proper documentation. They help reduce risks caused by rodents, insects, termites, and contamination while supporting health regulations. At Liaison Bank, we assist clients with dependable pest control certification services, pest management compliance, hygiene approvals, inspection coordination, and renewal support tailored for modern business operations.
            </p>
          </div>
          <div className="section-title">
          </div>
          <div className="section-title">
            <h3>Overview </h3>
          </div>
          <div className="container table-responsive py-2">
            <table className="mx-auto table table-bordered table-hover mx-auto w-100 w-md-75" >
              <thead className="thead-dark">
                <tr>
                  <th scope="col">What the Certification Covers</th>
                  <th scope="col">Business Value of Certification</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Site inspection of kitchens, storage zones, washrooms, entry points, and common areas</td>
                  <td>Demonstrates commitment to hygiene and safety standards</td>
                </tr>
                <tr>
                  <td>Review of pest activity, infestation signs, and high-risk zones</td>
                  <td>Minimizes disruption caused by recurring pest issues</td>
                </tr>
                <tr>
                  <td>Validation of approved treatment methods and chemical safety practices</td>
                  <td>Protects products, property, staff, and customers</td>
                </tr>
                <tr>
                  <td>Maintenance of service logs, monitoring reports, and treatment records</td>
                  <td>Supports audits, inspections, and regulatory checks</td>
                </tr>
                <tr>
                  <td>Certification issuance and timely renewal management</td>
                  <td>Strengthens trust, reputation, and compliance readiness</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="section-title">
            <h3>Conclusion </h3>
          </div>
          <div >
            <p>
             Strong hygiene standards begin with prevention, consistency, and professional oversight. With <b>Liaison Bank’s 
             Pest Control Services Certification</b>, businesses can maintain cleaner environments, meet compliance expectations, 
             and manage pest risks with confidence. Our expert support helps organizations protect their reputation, maintain 
             operational standards, and create safer spaces for everyone.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

