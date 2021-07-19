/** @format */

import React, {Component} from "react"

import Header from "parts/Header"
import PageDetailTitle from "parts/PageDetailTitle"
import FeaturedImage from "parts/FeaturedImage"
import PageDetailDescription from "parts/PageDetailDescription"
import BookingForm from "parts/BookingForm"

import itemDetails from "json/itemDetails.json"
import Categories from "parts/Categories"
import Testimony from "parts/Testimony"
import Footer from "parts/Footer"
import Fade from "react-reveal/Fade"

export default class DetailPage extends Component {
	componentDidMount() {
		window.title = "Details page"
		window.scrollTo(0, 0)
	}

	render() {
		const breadcrumb = [
			{pageTitle: "Home", pageHref: ""},
			{pageTitle: "House Details", pageHref: ""},
		]
		return (
			<>
				<Header {...this.props} />
				<PageDetailTitle breadcrumb={breadcrumb} data={itemDetails} />
				<FeaturedImage data={itemDetails.imageUrls} />
				<section className="container">
					<div className="row">
						<div className="col-7 pr-5">
							<Fade bottom>
								<PageDetailDescription
									data={itemDetails}
								></PageDetailDescription>
							</Fade>
						</div>
						<div className="col-5">
							<Fade bottom>
								<BookingForm itemDetails={itemDetails} />
							</Fade>
						</div>
					</div>
				</section>
				<Categories data={itemDetails.categories}></Categories>
				<Testimony data={itemDetails.testimonial}></Testimony>
				<Footer />
			</>
		)
	}
}
